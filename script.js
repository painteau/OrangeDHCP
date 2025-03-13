(function(){
    btn2.onclick = function(){
        var st11zero = '00:00:00:00:00:00:00:00:00:00:00';
        var idorange = '01'; // variable
        var idsalt= '3c'; // 16
        var idhash  = '03'; //1+16
        var fixed = '1a:09:00:00:05:58:01:03:41';
        
				function TLofTLS(id,l) {
            var toAdd = l.toString(16).toUpperCase();
            if (toAdd.length<2) toAdd = '0' + toAdd;
            return id + ':' + toAdd;
				}
        function SofTLS (s) {
          var i, toAdd;
          var res = '';
          for(i = 0; i < s.length; i++) {
              toAdd = s.charCodeAt(i).toString(16).toUpperCase();
              if (toAdd.length<2) toAdd = '0' + toAdd;
              res += toAdd;
              if (i<s.length-1) res += ":";
          }
          return res;
        }
        var Orange = 'fti/'+orange.value;
        var Salt = salt.value;
        var Byte = byte.value;
        var md5 = CryptoJS.MD5(Byte + password.value + Salt).toString();
        console.log(md5);
        var md5s = '';
        for(i = 0; i < md5.length; i+=2) {
        	md5s += md5[i]+md5[i+1];
          if (i<md5.length-2) md5s += ":";
				}
        console.log(md5s);
        output.value =
              st11zero + ':' + fixed + ':' +
              TLofTLS(idorange,2+Orange.length)+ ':' + SofTLS(Orange)+ ':' +
              TLofTLS(idsalt,2+16)+ ':' + SofTLS(Salt) + ':' +
              TLofTLS(idhash,2+1+16)+ ':' + SofTLS(Byte) + ':' + md5s;
         }
    
    // Fonction pour le bouton de copie du textarea
    document.getElementById('copy-btn').addEventListener('click', function() {
        var outputText = document.getElementById('output');
        outputText.select();
        document.execCommand('copy');
        
        // Effet visuel pour indiquer que la copie a été effectuée
        this.classList.add('copied');
        setTimeout(() => {
            this.classList.remove('copied');
        }, 1000);
    });
    
    // Fonction pour les boutons de copie des blocs de code
    document.querySelectorAll('.copy-code-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            // Récupérer le texte du bloc de code associé
            var codeText = this.parentNode.querySelector('code').innerText;
            
            // Créer un élément textarea temporaire pour la copie
            var tempTextarea = document.createElement('textarea');
            tempTextarea.value = codeText;
            document.body.appendChild(tempTextarea);
            
            // Sélectionner et copier le texte
            tempTextarea.select();
            document.execCommand('copy');
            
            // Supprimer l'élément temporaire
            document.body.removeChild(tempTextarea);
            
            // Effet visuel pour indiquer que la copie a été effectuée
            this.classList.add('copied');
            setTimeout(() => {
                this.classList.remove('copied');
            }, 1000);
        });
    });
})();