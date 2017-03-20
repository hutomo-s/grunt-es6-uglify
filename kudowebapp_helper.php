<?php

if (!function_exists('asset_src')) {
    /**
     * Generate an asset path for the application.
     *
     * @param  string  $path
     * @param  bool    $secure
     * @param string   $root
     * @return string
     */
    function asset_src($path, $secure = null)
    {
        $app = app();
        
        // default public path
        $publicPath = 'src';

        if (Config::get('env.asset_minify')) 
        {
            // this only applied to a minified javascript file
            $regex_js = '/js\/(\S+)\.js/';
            $match_js = preg_match($regex_js, $path, $matches_js);
            
            if($match_js)
            {
                $publicPath = 'dist';
                $path = "js/". str_replace("/","_",$matches_js[1]). ".min.js";
            }
        }

        $assets_version = Config::get("app.assets_version");

        $regex_extension = '/(\S+)(\.js|\.css|\.svg|\.png|\.jpeg|\.jpg)/';
        $match_compressed = preg_match($regex_extension, $path, $matches_compressed);

        if($match_compressed &&  $assets_version != "")
        {
            $path.= "?ver={$assets_version}";
        }

        // default root path to public/src
        $root = $publicPath;
        $url = $app['url']->to($root).'/';

        $default_path = $app['url']->asset($url . ltrim($path, '/'), $secure);

        $assets_cdn_path = Config::get("app.assets_cdn");

        // override path if using cdn
        if (!empty($assets_cdn_path)) {
            $cdn_str = $assets_cdn_path . '/' . $root . '/' . $path;
        } else {
            $cdn_str = $default_path;
        }

        return $cdn_str;
    }
}