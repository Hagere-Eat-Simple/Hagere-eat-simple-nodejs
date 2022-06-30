<?php
session_start();
include("../../config/connection.php");

    if(isset($_GET['searchQuery']))
        $search=$_GET['searchQuery'];
    else
        $search="";
$query = "select customer.username,email,phone,Rname,location,about,logo,active from customer inner join resturant on customer.username=resturant.username and active=0 and Rname LIKE '%$search%'";
$query_run = mysqli_query($con,$query);
echo<<< _END
    <div id="table">
    <table id="vendor_list">
      <thead>
    <tr>
        <th> LOGO</th>
        <th> USERNAME</th>
        <th> NAME</th>
        <th> EMAIL</th>
        <th> PHONE</th>
        <th> ADDRESS</th>
        <td >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         </td>

    </tr>
    </thead>
      </table>
      <div class="table">
    <table>
    <tbody>
    _END;
if (mysqli_num_rows($query_run) > 0){
        while ($row = mysqli_fetch_assoc($query_run)){ 
            $logo=$row['logo'];
            $uname=$row['username'];
            $rname=$row['Rname'];
            $location=$row['location'];
            $email=$row['email'];
            $phone=$row['phone'];
           
echo<<< _END
            <tr>
                <td> <img src="vendor_list/$uname/images/$logo" alt="logo" width="100px" height="100px"></td>
                <td>$uname</td>
                <td>$rname</td>
                <td>$email</td>
                <td>$phone</td>
                <td>$location</td>
                <td>
                 <form action = "suspended_vendors.php" method = "post">
                   <input type = "hidden" name = "activate_id" value = "$uname">
                   <button class="activate_button" type = "submit" name = "activate" id="activate" onclick="return confirm('Are you sure you want to activate?');">Activate</button>
                 </form>
                </td>
            </tr>
            _END;
        }
    }else{
        echo '<td colspan="7">No Records.</td>';
    }
echo" </tbody>
</table>
</div>
</div>

";

    ?>