const path               = require('path');
const glob               = require('glob');
const EntryPlugin        = require('webpack/lib/EntryPlugin');
const cordovaAssetTree   = require('corber/lib/targets/cordova/utils/cordova-assets');

class CorberWebpackPlugin {
  apply(compiler) {    
    let context = compiler.context;
    // let platform = process.argv.includes('--CORBER_PLATFORM=android') ? 'android' : 'ios';
    let platform = process.env.CORBER_PLATFORM;
    let cdvAssets = cordovaAssetTree.getPaths(platform, './corber/cordova');

    cdvAssets.files.forEach((file) => {
      if (file === 'plugins/**') {
        //need to build the tree until corber/cordova/utils/cordova-assets is upgraded
        let plugins = glob.sync(path.join('./corber/cordova', cdvAssets.assetsPath, 'plugins/**/*.js'));
        plugins.forEach((plugin) => {              
          new EntryPlugin(context, path.join(process.cwd(), plugin), plugin).apply(compiler);
        });
      } else {
        let filePath = path.join(process.cwd(), './corber/cordova', cdvAssets.assetsPath, file);
        new EntryPlugin(context, filePath, file).apply(compiler);
      }
    });
  }
}

module.exports = CorberWebpackPlugin;