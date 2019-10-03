module.exports = (api) => {
	api.cache(true);

	return {
        presets: [
            [
                '@babel/env',
                {
                    targets: {
                        node: 'current',
                    },
                },
            ],
            '@babel/preset-typescript',
        ],
    };
}