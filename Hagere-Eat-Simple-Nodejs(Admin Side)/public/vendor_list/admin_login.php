<?php

session_start();
include("connection.php");
extract($_REQUEST);

if(isset($login))
{
    if (!empty($_POST['remember'])){
        setcookie('Email',  $_POST['email'], time() + 60*60*24*30*12);
        setcookie('Password', $_POST['password'], time() + 60*60*24*30*12);
    }else{
        if (isset($_COOKIE['Email'])){
            setcookie('Email','');
        }
        if (isset($_COOKIE['Password'])){
            setcookie('Password', '');
        }
    }
    $sql=mysqli_query($con,"select * from admin_tb where admin_email='$email' && admin_password='$password' ");
    if(mysqli_num_rows($sql))
    {
        $row = mysqli_fetch_assoc($sql);
        $_SESSION['admin'] = $row['admin_username'];
        $success[] = "Login Successful";
        header( "refresh:2;url = admin_create.php" );
//        header("Location: admin_create.php");

    }
    else
    {
        $admin_login_error = "Invalid Username or Password";
    }
}

?>

<html lang="en">
<head>
    <style>
        form{
            color: #efefef;
            font-size: 1.1em;
            background-color:#8fbc8f;
            padding: 5em;
            border-radius: 1em;
            margin: 0 auto;
            width: 25%;
            /*box-shadow: .5em .5em 1em #2f4f4f;*/
            box-shadow: 2px 5px 5px rgb(41, 41, 39);
        }
        input{
            padding: 1.5em;
            border: none;
            outline: none;
            width: 100%;
            margin: 0 auto;
            place-items: center;
            font-weight: bolder;
            font-family: Verdana, sans-serif;
        }

        button{
            margin: 0 auto;
            width: 100%;
            font-size: 1em;
            outline: none;
            border:solid .1em #008000;
            padding: 1em;
            background-color: #efefef;
            color: #008000;
            border-radius: .2em;
            text-transform: uppercase;
        }
        button:hover{
            cursor: pointer;
            background-color: #008000;
            color:#efefef;
            transition: .3s ease-in-out;
        }
        h1,h2,h3{
            text-align: center;
            text-transform: uppercase;
            font-family: 'Courier New', serif;
            color: #000000;
        }
        .echo{
            color: #efefef;
            background-color:#008000;
            font-size: 1.2em;
            font-weight: bolder;
            font-family: "Arial Black", sans-serif;
            padding: .5em;
            border-radius: 50%;
        }
        .mode{
            width: 1.5em;
            float: right;
            cursor: pointer;
        }

    </style>
<!--    <link rel="stylesheet" href="css/font-awesome.css" />-->
<!--    <link rel="stylesheet" href="css/font-awesome.min.css" />-->

    <title>Admin login page</title>
</head>
<body style="background-color: #efefef" id="body">
<!--<h2 class="total" >Total admin registered in your organization ==></h2>-->
<div class="mode">
    <svg id="dark" onclick="moonIcon()" style="display: none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clip-rule="evenodd"
        />
    </svg>

    <svg id="light" onclick="sunIcon()" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
    </svg>
</div>
</div>
<h1 id="h1">Welcome admin</h1>
<h2 id="h2">Login to your account!</h2>
<form method="post" enctype="multipart/form-data">
  <h3>  <?php
      if (isset($admin_login_error)){
          echo "<p style='color: red'>$admin_login_error</p>";
      }
      if (isset($success)){
          foreach ($success as $success){
              echo "<p style='color: #008000;'>$success</p>";
          }
      }
      ?></h3>

    <label for="email">Email address:</label><br>
    <input type="email" name="email" id="email" value="<?php
    if (isset($_COOKIE['Email'])){
        echo $_COOKIE['Email'];
    }
    ?>" required/><br><br>

    <label for="password">Password:</label><br>
    <input type="password" name="password" id="password"  value="<?php
    if (isset($_COOKIE['Password'])){
        echo $_COOKIE['Password'];
    }
    ?>" required/><br><br>
    <button type="submit" name="login"  >Login</button><br><br>


    <input style="width: 5%;"  type="checkbox" id="check" title="Keep me signed in" name="remember" <?php if (isset($_COOKIE['remember'])){?> checked <?php } ?>>
    <label for="check">Keep me signed in</label>
    <br><br>
</form>
<h3 id="hv" style="float: right;">Total Admin:
    <?php
    $query = "SELECT `admin_id` FROM `admin_tb` ORDER BY admin_id";
    $query_run = mysqli_query($con, $query);
    $row1  = mysqli_num_rows($query_run);
    echo "<span class='echo'>$row1</span>";
    ?>
          </h3>
<script>
    function sunIcon() {
        document.getElementById("body").style.backgroundColor = "#000000";
        document.getElementById("body").style.color = "#efefef";
        document.getElementById("light").style.display = "none";
        document.getElementById("dark").style.display = "inline";
        document.getElementById("h1").style.color = "#fff";
        document.getElementById("h2").style.color = "#fff";
        document.getElementById("hv").style.color = "#fff";
        // document.getElementById("v_form").style.backgroundColor = " #8fbc8f";

    }

    function moonIcon() {
        document.getElementById("body").style.backgroundColor = "#efefef";
        document.getElementById("body").style.color = "#000000";
        document.getElementById("dark").style.display = "none";
        document.getElementById("light").style.display = "inline";
        document.getElementById("h1").style.color = "#000";
        document.getElementById("h2").style.color = "#000";
        document.getElementById("hv").style.color = "#000";
        // document.getElementById("v_form").style.backgroundColor = " #efefef transparent";
    }
</script>
</body>
</html>