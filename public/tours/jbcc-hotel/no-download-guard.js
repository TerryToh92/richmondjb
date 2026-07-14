(function(){
    // Deters casual downloading of tour videos/images (right-click save,
    // native download button, drag-to-desktop). This is NOT DRM: anyone
    // using browser devtools or the network tab can still retrieve the
    // underlying files. Kept as a standalone script (not a patch to the
    // 3DVista-generated player) so it survives re-exports of the tour.

    document.addEventListener('contextmenu', function(e){ e.preventDefault(); }, false);

    function guard(el){
        if(el.tagName === 'VIDEO'){
            el.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen');
            el.disablePictureInPicture = true;
            el.removeAttribute('controls');
        }
        if(el.tagName === 'VIDEO' || el.tagName === 'IMG'){
            el.draggable = false;
            el.addEventListener('dragstart', function(e){ e.preventDefault(); });
        }
    }

    document.querySelectorAll('video, img').forEach(guard);

    new MutationObserver(function(mutations){
        mutations.forEach(function(m){
            m.addedNodes && m.addedNodes.forEach(function(node){
                if(node.nodeType !== 1) return;
                guard(node);
                if(node.querySelectorAll) node.querySelectorAll('video, img').forEach(guard);
            });
        });
    }).observe(document.documentElement, {childList:true, subtree:true});
})();
