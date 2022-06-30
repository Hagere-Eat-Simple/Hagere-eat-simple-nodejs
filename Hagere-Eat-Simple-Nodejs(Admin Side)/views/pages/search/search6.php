<?php
session_start();
include("../../config/connection.php");

    if(isset($_GET['searchQuery']))
        $search=$_GET['searchQuery'];
    else
        $search="";
$query = "SELECT username,email,phone,fname,lname FROM customer WHERE flag=4 AND active=0 AND username LIKE '%$search%'";
$query_run = mysqli_query($con,$query);
echo<<< _END
    <div id="table">
    <table id="customer_list">
        <thead>
        <tr>
            <th>CUSTOMER USERNAME</th>
            <th>CUSTOMER Name</th>
            <th>CUSTOMER EMAIL</th>
            <th>CUSTOMER PHONE</th>
            <th></th>
            <th></th>
        </tr>
        </thead>
         </table>
        <div class="table">
        <table>
        <tbody>
    _END;
if (mysqli_num_rows($query_run) > 0){
        while ($row = mysqli_fetch_assoc($query_run)){ 
            $uname=$row['username'];
            $name=$row['fname']." ".$row['lname'];
            $email=$row['email'];
            $phone=$row['phone'];
           
echo<<< _END
                <tr>
                <td>$uname</td>
                <td>$name</td>
                <td>$email</td>
                <td>$phone</td>
                 <td colspan="2">
                 <td colspan="2">
                <form action = "suspended_customers.php" method = "post">
                <input type = "hidden" name = "activate_id" value = "$uname">
                <button class="activate_button" type = "submit" name = "activate" id="activate" onclick="return confirm('Are you sure you want to activate?');">Activate</button>
                </form>
            </td>
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