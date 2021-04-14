

export class error_gl
{
  /**
   * @brief Getting the description of the error code in the WebGL2 context
   * 
   * @param error_code Error number returned from WebGLRenderingContext.getError()
   * 
   * @returns The description of the 
   */
  public static message(error_code : GLenum) : string {
    switch(error_code){
      case WebGLRenderingContext.INVALID_ENUM:
        return "GL_INVALID_ENUM: An unacceptable value is specified for an "+
               "enumerated argument. The offending command is ignored and has "+
               "no other side effect than to set the error flag.\n";
      break;
      case WebGLRenderingContext.INVALID_VALUE:
        return "GL_INVALID_VALUE: A numeric argument is out of range. The "+
               "offending command is ignored and has no other side effect than "+
               "to set the error flag.\n";
      break;
      case WebGLRenderingContext.INVALID_OPERATION:
        return "GL_INVALID_OPERATION: The specified operation is not allowed in "+
               "the current state. The offending command is ignored and has no "+
               "other side effect than to set the error flag.\n";
      break;
      case WebGLRenderingContext.INVALID_FRAMEBUFFER_OPERATION:
        return "GL_INVALID_FRAMEBUFFER_OPERATION: The framebuffer object is "+
               "not complete. The offending command is ignored and has no other "+
               "side effect than to set the error flag.\n";
      break;
      case WebGLRenderingContext.OUT_OF_MEMORY:
        return "GL_OUT_OF_MEMORY: There is not enough memory left to execute "+
               "the command. The state of the GL is undefined, except for the "+
               "state of the error flags, after this error is recorded.\n";
      break;
      case WebGLRenderingContext.CONTEXT_LOST_WEBGL:
        return "GL_CONTEXT_LOST_WEBGL: If the WebGL context is lost, this error is "+
               "returned on the first call to getError. Afterwards and until the "+
               "context has been restored, it returns gl.NO_ERROR.\n";
      break;
      case WebGLRenderingContext.NO_ERROR:
        return "No error has been recorded. The value of this constant is 0.";
      break;
      default: return "Unknown error code"; break;
    }
  }
  /**
   * @brief Getting all the current error descriptions in the WebGL context
   * 
   * @param context WebGL rendering context
   * 
   * @returns All the existing error descriptions
   */
  public static messages(context : WebGL2RenderingContext) : string {
    let error_message : string = "";
    let error_code : GLenum = 0;

    while((error_code = context.getError()) != WebGLRenderingContext.NO_ERROR){
      error_message += error_gl.message(error_code);
    }

    return error_message;
  }
}