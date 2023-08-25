const babel = require('@babel/core');
const HtmlWebpackPlugin = require("html-webpack-plugin");

class HtmlJsToES5Plugin {
	process(htmlPluginData) {
		return new Promise(function (resolve) {
			const scriptRegExp = /<script>[\s\S]*?<\/script>/gis;
			htmlPluginData.html = htmlPluginData.html.replace(scriptRegExp, function (match) {
				const code = match.replace("<script>", "").replace("</script>", "");
				const es5Code = babel.transform(code, { 'presets': ['@babel/preset-env'] }).code;
				return `<script>${es5Code}</script>`;
			});
			resolve();
		});
	};


	apply(compiler){
		compiler.hooks.compilation.tap('HtmlJsToES5Plugin', (compilation) => {
			HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
				"HtmlJsToES5Plugin",
				async (html, cb) => {
					await this.process(html);
					cb(null, html);
				}
			);
		});
	}
}

module.exports = HtmlJsToES5Plugin;
