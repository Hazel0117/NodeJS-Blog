$(function() {
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
});
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
