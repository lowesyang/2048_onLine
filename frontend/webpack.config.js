var webpack=require("webpack");
var extractTextPlugin=require("extract-text-webpack-plugin");

module.exports={
    plugins:[new extractTextPlugin("[name].css")],
    entry:{
        run:'./drive/connector.js'
    },
    output:{
        path:'drive/',
        filename:'[name].js'
    },
    module:{
        loaders:[
            {
                test:/\.css$/,
                loader:extractTextPlugin.extract("style-loader", "css-loader")
            }
        ]
    },
    resolve:{
        root:'D:/website/2048/frontend',
        alias:{
            game:'src/game.js',
            block:'src/block.js',
            tools:'src/tools.js'
        }
    }
}