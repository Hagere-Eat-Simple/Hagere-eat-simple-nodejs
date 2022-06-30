<?php

session_start();
include("../config/connection.php");
 if($_SESSION['state']!=3)
    {
      header("Location:../index.php");
    }
if(isset($_POST['deposit_btn']))
{
    $sender=$_SESSION['uname'];
    $id=$_POST['edit_id'];
    $initial=$_POST['wallet_val'];
    $deposit=$_POST['deposit_value'];
    $final=$initial+$deposit;
    $sql=mysqli_query($con,"UPDATE customer SET wallet=$final WHERE username='$id'");
    $sql2=mysqli_query($con,"INSERT INTO deposits(sender,username,amount,total) VALUES ('$sender','$id','$deposit','$final')");
    header("Location: active_customers.php");
    exit;
}

?>

<html>
<head>
<!--    style-->
    <link rel="stylesheet" href="../resources/css/edit_admin.css" />


<!--    title-->

    <link rel="shortcut icon" href="../resources/images/logo.png" type="image/x-icon">
        <title>Hagere Hub</title>
</head>
<body style="background: #efefef">
<h2>Deposit to Account</h2>
<!--php starts here-->
<?php
if(isset($_POST['deposit'])){
    $id = $_POST['id'];
    $qry = "SELECT * from customer where username='$id'";
    $qry_run = mysqli_query($con,$qry);
    foreach ($qry_run as $row){
        ?>
<!--            form starts-->
 <form action="deposit.php" method="post" enctype = "multipart/form-data">
        <input type="hidden" name="edit_id" value="<?php echo $id ?>">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label for="wallet_val">Wallet Amount:</label>
        <input type="text"  name="wallet_val" id="wallet" value="<?php echo $row['wallet'] ?>" readonly/>
        <br><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label for="deposit">Deposit Amount:</label>
        <input type="text" id="deposit" placeholder="Enter Deposit Amount" name="deposit_value" required/>
        <br><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         <a style="text-decoration: none;color: coral" href="index.php">Return To Home</a>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button style="color: green; outline: none; border: none; background: none; cursor: pointer;" type="submit" name="deposit_btn" onclick="return confirm('Are you sure you want to deposit ?');" >Deposit</button>
</form>
<br><br><br>
<!--        php ends-->
        <?php
    }}
?>

</body>
</html>