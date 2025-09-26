// EmailJS integration for the Get In Touch form
// 1) Sign up at https://www.emailjs.com/
// 2) Create a service and email template
// 3) Put your PUBLIC KEY, SERVICE ID and TEMPLATE ID below

(function(){
  var FORM_SELECTOR = '.contact-form[data-emailjs="true"]';
  var form = document.querySelector(FORM_SELECTOR);
  if(!form) return;

  // TODO: Replace with your actual keys (never commit secrets in production)
  var EMAILJS_PUBLIC_KEY = 'goCUoyAPrsPJyA1av';
  var EMAILJS_SERVICE_ID = 'service_o2sci7l';
  var EMAILJS_TEMPLATE_ID = 'template_hklw2ed';

  if(typeof emailjs === 'undefined'){
    console.warn('EmailJS SDK not loaded.');
    return;
  }
  try{ emailjs.init(EMAILJS_PUBLIC_KEY); }catch(e){ console.warn('EmailJS init failed', e); }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var data = new FormData(form);
    var payload = {
      firstName: data.get('firstName') || '',
      lastName: data.get('lastName') || '',
      email: data.get('email') || '',
      message: data.get('message') || '',
    };
    var submitBtn = form.querySelector('button[type="submit"]');
    if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload)
      .then(function(){
        alert('Thanks '+ (payload.firstName+' '+payload.lastName).trim() +'! Your message has been sent.');
        form.reset();
      })
      .catch(function(err){
        console.error(err);
        alert('Sorry, there was a problem sending your message.');
      })
      .finally(function(){ if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Submit'; }});
  });
})();


