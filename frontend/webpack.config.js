var webpack=require("webpack");
var extractTextPlugin=require("extract-text-webpack-plugin");

module.exports={
    plugins:[new extractTextPlugin("[name].css")],
    entry:{
        run:'./connector.js'
    },
    output:{
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
            game:'game.js',
            block:'block.js'
        }
    }
}