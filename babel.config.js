module.exports = function(api) {
  const plugins = [];
  if(api.env() == 'production')
    plugins.push('transform-remove-console');

    api.cache(true);  
  return {
    presets: ['babel-preset-expo'],
    plugins
  };
};
