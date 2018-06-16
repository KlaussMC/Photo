function handleFileSelect(evt) {
    var files = evt.target.files;

    window.vars.moveProgressBar(25);

    for (var i = 0, f; f = files[i]; i++) {

        var reader = new FileReader();

        reader.onload = (function(f, reader) {
            return function() {
                var contents = reader.result;

                var obj = { name: f.name, cont: contents }

                //- console.log(contents);
                var xhr = new XMLHttpRequest()
                xhr.open('post', '/dashboard', true)
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                
                try {
                    xhr.send(JSON.stringify(obj));
                } catch (e) {
                    alert("The file you have sent is too large.")
                }

                xhr.onreadystatechange = function () {
                    window.vars.moveProgressBar(xhr.readyState * 25)
                }
            }

        })(f, reader);

        reader.readAsText(f);
    }
}
document.querySelector('#file').addEventListener('change', handleFileSelect, false);
