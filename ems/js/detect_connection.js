window.addEventListener("offline", function(e) {
    s_alert('error', 'warning', 'Cehck your connection...');
});
window.addEventListener("online", function(e) {
    s_alert('success', 'success', 'You are online Now!');
    setTimeout(()=>{location.reload();}, 2000) 
});