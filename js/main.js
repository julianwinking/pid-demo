document.getElementById('model1-btn').addEventListener('click', function() {
    document.getElementById('model1').style.display = 'flex';
    document.getElementById('deepdive').style.display = 'none';
});

document.getElementById('tutorial-btn').addEventListener('click', function() {
    document.getElementById('tutorial-popup').style.display = 'block';
});

document.getElementById('deepdive-btn').addEventListener('click', function() {
    document.getElementById('model1').style.display = 'none';
    document.getElementById('deepdive').style.display = 'flex';
    // Remove the call to loadDeepDiveContent
    // loadDeepDiveContent();
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('tutorial-popup').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('model1').style.display = 'flex';
    document.getElementById('deepdive').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('introduction-btn').addEventListener('click', () => {
      document.getElementById('introduction-section').style.display = 'block';
      document.getElementById('controllers-section').style.display = 'none';
  });

  document.getElementById('controllers-btn').addEventListener('click', () => {
      document.getElementById('introduction-section').style.display = 'none';
      document.getElementById('controllers-section').style.display = 'block';
  });
});