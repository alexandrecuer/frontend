<?php

function view($filepath, array $args = array())
{
    $content = '';
    if (file_exists($filepath)) {
        extract($args);
        ob_start();
        include "$filepath";
        $content = ob_get_clean();
    }
    return $content;
}

function server($index)
{
    $val = null;
    if (isset($_SERVER[$index])) {
        $val = $_SERVER[$index];
    }
    return $val;
}

function request_header($index)
{
   $val = null;
   $headers = apache_request_headers();
   if (isset($headers[$index])) {
        $val = $headers[$index];
  }
  return $val;
}

function get_application_path()
{
    // Default to http protocol
    $proto = "http";

    // Detect if we are running HTTPS or proxied HTTPS
    if (server('HTTPS') == 'on') {
        // Web server is running native HTTPS
        $proto = "https";
    } elseif (server('HTTP_X_FORWARDED_PROTO') == "https") {
        // Web server is running behind a proxy which is running HTTPS
        $proto = "https";
    } elseif (request_header('HTTP_X_FORWARDED_PROTO') == "https") {
        $proto = "https";
    }

    if (isset($_SERVER['HTTP_X_FORWARDED_HOST'])) {
        $path = dirname("$proto://" . server('HTTP_X_FORWARDED_HOST') . server('SCRIPT_NAME')) . "/";
    } else {
        $path = dirname("$proto://" . server('HTTP_HOST') . server('SCRIPT_NAME')) . "/";
    }

    return $path;
}

$colors = ["blue","sun","yellow2","standard","copper","black","green"];
$nbcol = random_int(0,6);

$path = get_application_path();

$v = 31;
$q = ""; if (isset($_GET['q'])) $q = $_GET['q'];

require "route.php";
$route = new Route($q);

$menu["setup"]["name"] = "Setup";
$menu["setup"]["icon"] = "menu";

$i=1;
$menu["setup"]["l2"]['input'] = array(
    "name"=>"Inputs",
    "href"=>"inputs/view",
    "order"=>$i,
    "icon"=>"leaf"
);
$i+=1;
$menu["setup"]["l2"]['feed'] = array(
    "name"=>"Feeds",
    "href"=>"feed/view",
    "order"=>$i,
    "icon"=>"format_list_bulleted"
);
$i+=1;
$menu["setup"]["l2"]['graph'] = array(
    "name"=>"graph",
    "href"=>"graph/view",
    "order"=>$i,
    "icon"=>"show_chart"
);

if ($route->controller=="graph" and $route->action=="view"){
  $i=1;
  $menu["setup"]['l2']['graph']["l3"]['first'] = array(
      "name"=>"first graph",
      "href"=>"graph/view?id=1",
      "order"=>$i
  );
  $i+=1;
  $menu["setup"]['l2']['graph']["l3"]['second'] = array(
      "name"=>"second graph",
      "href"=>"graph/view?id=2",
      "order"=>$i
  );
  $i+=1;
  $menu["setup"]['l2']['graph']["l3"]['third'] = array(
      "name"=>"third graph",
      "href"=>"graph/view/3",
      "order"=>$i
  );
}

?>
<html class="theme-<?php echo $colors[$nbcol]; ?> sidebar-dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1">
  <link href="<?php echo $path; ?>menu/emoncms-base.css?v=<?php echo $v; ?>" rel="stylesheet">
  <link href="<?php echo $path; ?>menu/menu.css?v=<?php echo $v; ?>" rel="stylesheet">
  <link href="<?php echo $path; ?>menu/bootstrap.css" rel="stylesheet">
  <script type="text/javascript" src="<?php echo $path; ?>menu/jquery-3.6.0.js"></script>
  <script type="text/javascript" src=<?php echo $path; ?>menu/menu.js?v=<?php echo $v; ?>></script>
  <?php echo view("menu/svg_icons.svg", array()) ?>
</head>
<body>
<div id="wrap">
    <div class="menu-top bg-menu-top">
        <div class="menu-l1"><ul></ul></div>
        <div class="menu-tr"><ul></ul></div>
    </div>
    <div class="menu-l2"><div class="menu-l2-inner"><ul></ul></div><div id="menu-l2-controls"></div></div><div class="menu-l3"><ul></ul></div>
    <main class="content-container">
        <script>
        var path = "<?php echo $path; ?>";
        var q = "<?php echo $q; ?>"+location.search+location.hash;

        // Draw menu just before drawing content but after defining content-container
        menu.init(<?php echo json_encode($menu); ?>);

        </script>
        <?php
        echo "The requested controller is: ".$route->controller."<br>";
        echo "The requested action is: ".$route->action."<br>";
        echo "The requested format is: ".$route->format."<br>";
        if ($route->subaction){
          echo "route with a subaction / $route->subaction";
        }
        if (@$_GET['id']){
          echo "route with an id parameter / ".$_GET['id'];
        }
        ?>
    </main>
</div>
</body>
</html>
