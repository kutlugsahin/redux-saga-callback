module.exports = (api) => {
	api.cache(true);

	return {
        presets: ['@babel/env', '@babel/preset-typescript'],
    };
}