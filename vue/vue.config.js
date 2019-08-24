module.exports = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:37433',
                ws: true,
                changeOrigin: true,
            },
        },
    },
}
