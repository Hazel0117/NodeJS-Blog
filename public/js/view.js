/*$(function() {
	$('#like').click(function(){
		$.ajax( {
			url: window.location.href,
			dataType: 'json',
			type: 'post',
			cache: false,
			success: function(data) {
				data = parseInt(JSON.stringify(data));
				console.log('request success');
				$('.post-favorite').text("被赞:"+data );

			}
		});
	});
});*/
function liked() {
	var xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	}
	else {
		//For IE5,IE6
		xmlhttp = new ActiveXObjext('Microsoft.XMLHTTP');
	}
	var url = window.location.href;
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
			document.querySelector('.post-favorite').innerHTML = "被赞:" + xmlhttp.responseText;
		} 
	};
	xmlhttp.open('post', url, true);
	xmlhttp.send();
	
}
var like = document.getElementById('like');
like.addEventListener('click', liked, false);
$('#delete').click(
	function() {
		if(confirm('确定删除？')) {
			return true;
		}
		else {
			return false;
		}
	}
);
