<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';
 
sec_session_start();

?>
<html>
	<head>
        <title>Upload a new Model</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/jquery.scrollgress.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js"></script>
		<noscript>
			<link rel="stylesheet" href="css/skel.css" />
			<link rel="stylesheet" href="css/style.css" />
			<link rel="stylesheet" href="css/style-wide.css" />
		</noscript>
        <link rel="stylesheet" href="styles/main.css" />
        <script type="text/JavaScript" src="js/sha512.js"></script> 
        <script type="text/JavaScript" src="js/forms.js"></script> 
    </head>
<body>

		 <?php if (login_check($mysqli) == true) : ?>
            <!-- Header -->
			<?php include 'includes/MainMenu.php'; ?>
			
		<section id="main" class="container">
		<section class="box">
			<h3>Upload Models:</h3>
			<form action="includes/upload_model.php" method="post" enctype="multipart/form-data">
			
			<div class="row uniform half ollapse-at-2">
				<div class="6u">
					
					<?php if($_SESSION['tablecheck']<>"") :
								{ ?>
									<input type="text" name="dataset" id="dataset" value=<?php echo $_SESSION['tablename'];?> placeholder="Model Set Name" />
									<label><font color="red">The Model Name already exists!!</font></label>
						<?php 	} 
								else :
								{ ?>
									<input type="text" name="dataset" id="dataset" value="" placeholder="Model Set Name" />
						<?php	}
								endif; ?>
				</div>
				
			</div>
			<div class="row uniform half ollapse-at-2">
				
					<label for="file">Select the csv file to upload:</label>
					<input type="file" name="file" id="file" ><br>
			</div>
			
			<input type="submit" name="submit" value="Submit">
			</form>
		</section>
		</section>
		
		<?php else : ?>
					<p>
						<span class="error">You are not authorized to access this page.</span> Please <a href="Login.php">login</a>.
					</p>
        <?php endif; ?>
		<!-- Footer -->
			<footer id="footer">
				
				<ul class="copyright">
					<li>&copy; Madison Business Analytics. All rights reserved.</li><li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
				</ul>
			</footer>
</body>
</html>