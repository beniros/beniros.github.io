/**
* Formspree Email Form Integration - v1.0
* URL: https://formspree.io/
* Author: Modified from BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!')
        return;
      }
      
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'submit'})
              .then(token => {
                formData.append('g-recaptcha-response', token);
                formSubmit(thisForm, action, formData);
              })
            } catch (error) {
              displayError(thisForm, error)
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!');
        }
      } else {
        formSubmit(thisForm, action, formData);
      }
    });
  });

  function formSubmit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
    })
    .then(response => response.json())
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.ok) {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      } else {
        throw new Error(data.error ? data.error : 'Form submission failed and no error message returned from: ' + action);
      }
    })
    .catch((error) => {
      displayError(thisForm, error.message || 'Form submission failed');
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }
})();
