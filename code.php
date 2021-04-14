<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>Code</title>
<script src="js/jquery-2.1.4.min.js"></script>
<script src="js/highlight.js"></script>
<script src="js/highlightjs-line-numbers.js"></script>
<link href="css/darkula.css" rel="stylesheet" type="text/css">
<style>
html, body {
	padding:0;
	margin:0;
	height:100%;
	background:#1b2426;
	color:#1b2426;
	font-size:13px;
}
body > section {
	width:100%;
	height:100%;
	overflow:auto;
}
.hljs-line-numbers {
	text-align: right;
	border-right: 1px solid #777;
	color:#666;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
</style>
<script>
$(document).ready(function() {
	hljs.configure({
		tabReplace: '    ',
		language: 'javascript'
	})
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
		hljs.lineNumbersBlock(block);
  });
});
</script>
</head>

<body>
<section>
  <article>
    <pre><code><?php include('js/bio.js'); ?></code></pre>
  </article>
</section>
</body>
</html>