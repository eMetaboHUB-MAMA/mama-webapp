//
checkUploadFileForm = function() {
	if ($("#file").val() == '') {
		return false;
	}
	return true;
};
// file upload
$(document).on('change', '.btn-file-upload.btn-file :file', function() {
	var input = $(this), numFiles = input.get(0).files ? input
			.get(0).files.length : 1, label = input.val()
			.replace(/\\/g, '/').replace(/.*\//, '');
	input.trigger('fileselect', [ numFiles, label ]);
});
$(document).ready(function() {
	$('.btn-file-upload.btn-file :file').on('fileselect',function(event, numFiles, label) {
		var input = $(this).parents(
				'.input-group').find(':text'), log = numFiles > 1 ? numFiles
				+ ' files selected'
				: label;
		if (input.length) {
			input.val(log);
			// startUpload();
			$("#addFileFormContent").appendTo(
					"#fileUploadForm");
			$("#fileUploadForm").submit();
		} else {
			if (log)
				alert(log);
		}
	});

	$("#fileUploadForm").ajaxForm({
		beforeSubmit : startUploadFile,
		success : function(data) {
			try {
				data = data.replace('</pre>','').replace(/<(.*)>/gi, '');
				data = JSON.parse(data);
			} catch (e){}
			if (data.hasOwnProperty('success')) {
				if (data.success) {
					// TODO fullfield hidden input
					$("#attachedFile").val(data.file);
					var successBox = '<div class="alert alert-success alert-dismissible" role="alert">';
					successBox += '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
					successBox += '<strong>success</strong> file uploaded!';
					successBox += ' </div>';
					$("#fileUploadSuccess").html(successBox);
				} else {
					// alert message
					var errorBox = '<div class="alert alert-warning alert-dismissible" role="alert">';
					errorBox += '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
					errorBox += '<strong>'+_warning1_+'</strong> could not process uploaded file.';
					errorBox += ' </div>';
					$("#fileUploadError").html(errorBox);
				}
			} else{
				// alert message
				var errorBox = '<div class="alert alert-danger alert-dismissible" role="alert">';
				errorBox += '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
				errorBox += '<strong>'+_warning1_+'</strong> could not upload file.';
				errorBox += ' </div>';
				$("#fileUploadError").html(errorBox);
			}
			
			$("#fileUploading").hide();
			$("#addFileFormContent").appendTo("#fileUploadContainer");
		},
		error : function() {
			// alert message
			var errorBox = '<div class="alert alert-danger alert-dismissible" role="alert">';
			errorBox += '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
			errorBox += '<strong>'+_warning1_+'</strong> could not upload file';
			errorBox += ' </div>';
			$("#fileUploadError").html(errorBox);
			$("#fileUploading").hide();
			$("#addFileFormContent").appendTo("#fileUploadContainer");
		}
	});
});

function startUploadFile() {
	$("#fileUploadError").html("");
	$("#fileUploading").show();
	//
}