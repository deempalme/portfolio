
export class planets_shader {
  public static vertex : string | null = 
    "#version 300 es\n"+

    "precision mediump float;\n"+

    // TODO: delete unused variables in model_loader
    // attributes
    "layout (location = 0) in vec3 i_position;\n"+
    "layout (location = 1) in vec2 i_uv;\n"+
    "layout (location = 2) in vec3 i_normal;\n"+

    // uniforms
    "uniform mat4 u_pv;\n"+ // Projection and view matrix
    "uniform mat4 u_model;\n"+ // model matrix
    "uniform mat3 u_normal_matrix;\n"+ // normal matrix
    "uniform vec3 u_camera_position;\n"+

    // data for fragment shader
    "out vec2 f_uv;\n"+
    "out vec3 f_normal;\n"+
    "out vec3 f_light;\n"+
    "out vec3 f_camera;\n"+
    "out vec3 f_position;\n"+

    ///////////////////////////////////////////////////////////////////

    "void main(void){\n"+
      // Translating the planet
    "  vec4 frag_position = u_model * vec4(i_position, 1.0);\n"+

    "  f_uv       = i_uv;\n"+
    "  f_position = frag_position.xyz;\n"+
    "  f_normal   = u_normal_matrix * i_normal;\n"+
    "  f_light    = normalize(-frag_position.xyz);\n"+
    "  f_camera   = normalize(u_camera_position - frag_position.xyz);\n"+

      // calculate screen space position of the vertex
    "  gl_Position = u_pv * frag_position;\n"+
    "}";

  public static fragment : string | null = 
    "#version 300 es\n"+

    "precision mediump float;\n"+

    // data from vertex shader
    "in vec2 f_uv;\n"+
    "in vec3 f_normal;\n"+
    "in vec3 f_light;\n"+
    "in vec3 f_camera;\n"+
    "in vec3 f_position;\n"+

    // textures
    "uniform sampler2D u_albedo;\n"+
    "uniform sampler2D u_normal;\n"+
    "uniform sampler2D u_specular;\n"+
    "uniform sampler2D u_lights;\n"+

    "uniform float u_use_specular;\n"+
    "uniform float u_use_lights;\n"+
    "uniform vec3  u_fresnel_color;\n"+

    "layout (location = 0) out vec4 o_color;\n"+

    //Bump Mapping Unparametrized Surfaces on the GPU by Morten S. Mikkelsen
    // http://api.unrealengine.com/attachments/Engine/Rendering/LightingAndShadows/BumpMappingWithoutTangentSpace/mm_sfgrad_bump.pdf
    // https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/bumpmap_pars_fragment.glsl
    "vec2 dHdxy_fwd( sampler2D bumpMap, vec2 uv, float bumpScale ){\n"+
    "  vec2 dSTdx = dFdx( uv );\n"+
    "  vec2 dSTdy = dFdy( uv );\n"+
    "  float Hll  = bumpScale * texture( bumpMap, uv ).x;\n"+
    "  float dBx  = bumpScale * texture( bumpMap, uv + dSTdx ).x - Hll;\n"+
    "  float dBy  = bumpScale * texture( bumpMap, uv + dSTdy ).x - Hll;\n"+
    "  return vec2( dBx, dBy );\n"+
    "}\n"+

    "vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ){\n"+
       // Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988
    "  vec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );\n"+
    "  vec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );\n"+
    "  vec3 vN = surf_norm;\n"+  // normalized
    "  vec3 R1 = cross( vSigmaY, vN );\n"+
    "  vec3 R2 = cross( vN, vSigmaX );\n"+

    "  float fDet = dot( vSigmaX, R1 );\n"+
    "  fDet *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n"+

    "  vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n"+
    "  return normalize( abs( fDet ) * surf_norm - vGrad );\n"+
    "}\n"+

    //////////////////////////////////////////////////////

    "const float u_bump_scale = 0.05;\n"+
    "const float u_ambient_strength = 0.0;\n"+
    "const float u_diffuse_strength = 1.0;\n"+
    "const vec3  u_light_color = vec3(1.0);\n"+
    "const float u_specular_strength = 0.2;\n"+
    "const float u_specular_shininess = 2.0;\n"+

    "void main(void){\n"+
       // get diffuse color
    "  vec3 color = texture(u_albedo, f_uv).rgb;\n"+
    "  vec3 n_normal = normalize(f_normal);\n"+
    "  vec3 n_light  = normalize(f_light);\n"+
    "  vec3 n_camera = normalize(f_camera);\n"+

       //Calc New Fragment Normal based on Bump Map.
    "  vec2 dHdxy = dHdxy_fwd(u_normal, f_uv, u_bump_scale);\n"+
    "  vec3 bump_norm = perturbNormalArb(f_position, n_normal, dHdxy);\n"+

       // obtain normal from normal map in range [0,1]
    "  vec3 normal = normalize(texture(u_normal, f_uv).rgb * 2.0 - 1.0);\n"+

       // Diffuse lighting
    "  float f_to_light_angle = dot(n_normal, n_light) * 0.5 + 0.5;\n"+
    "  float diffuse = smoothstep(0.1, 0.5, f_to_light_angle * u_diffuse_strength);\n"+
    "  float diffuse_bump = min(diffuse + dot(bump_norm, n_light), 1.1);\n"+

       // Specular lighting
    "  vec3 v_reflect = reflect(-n_light, n_normal);\n"+
    "  float specular = pow(clamp(dot(v_reflect, n_camera), 0.0, 1.0), u_specular_shininess) * u_specular_strength;\n"+

       // Final color
    "  o_color = vec4(color * u_light_color * (u_ambient_strength + diffuse_bump + specular), 1.0);\n"+

       // Mix night lights
    "  vec4 night = texture(u_lights, f_uv);\n"+
    "  o_color = mix(night, o_color, diffuse);\n"+

    "  vec3 rim_color = vec3(0.0, 0.57, 0.79);\n"+
    "  float f_to_camera_angle = (1.0 - dot(n_camera, n_normal));\n"+
    "  f_to_camera_angle = pow(f_to_camera_angle, 3.0);\n"+

    "  o_color.rgb += rim_color * f_to_camera_angle * smoothstep(0.0, 0.5, f_to_light_angle);\n"+
    "}";
};