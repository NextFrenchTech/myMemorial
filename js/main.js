/* audioPlaylist */

/* autoPlayPopUp */

document.addEventListener("DOMContentLoaded", function() {
    var popup = document.getElementById("popup");
    var acceptButton = document.getElementById("acceptButton");
    var rejectButton = document.getElementById("rejectButton");
    var audio = document.getElementById("audio");

    // Vérifier si l'utilisateur a déjà répondu
    var userResponse = getCookie("userResponse");

    if (userResponse === "accepted") {
        // Si l'utilisateur a déjà répondu "accepté", masquer la pop-up
        popup.style.display = "none";
    } else if (userResponse === "rejected") {
        // Si l'utilisateur a déjà répondu "rejeté", masquer la pop-up et arrêter la musique
        popup.style.display = "none";
        audio.pause(); // Arrêter la musique si elle est en cours de lecture
    } else {
        // Afficher la fenêtre pop-up après 1 seconde si l'utilisateur n'a pas encore répondu
        setTimeout(function() {
            popup.style.display = "block";
        }, 1000);
    }

    // Gérer la réponse de l'utilisateur
    acceptButton.addEventListener("click", function() {
        popup.style.display = "none";
        audio.play(); // Démarrer la lecture audio
        setCookie("userResponse", "accepted"); // Enregistrer la réponse dans un cookie
    });

    rejectButton.addEventListener("click", function() {
        popup.style.display = "none";
        setCookie("userResponse", "rejected"); // Enregistrer la réponse dans un cookie
    });

    // Fonction pour définir un cookie
    function setCookie(name, value) {
        document.cookie = name + "=" + value + ";path=/";
    }

    // Fonction pour récupérer la valeur d'un cookie
    function getCookie(name) {
        var cookieName = name + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var cookieArray = decodedCookie.split(';');
        for(var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return "";
    }
});


/* customName */

const audio = document.getElementById("audio");
const nameElement = document.querySelector(".name"); // Stocker l'élément DOM

// Mettre à jour le titre en cours de lecture
const updateCurrentAudioTitle = () => {
    if (audio && nameElement) {
        const audioSrc = audio.currentSrc; // Obtenez l'URL complète du fichier audio actuel
        const fileName = audioSrc.split('/').pop(); // Récupérez le nom du fichier à partir de l'URL
        const title = fileName.replace(/\.[^/.]+$/, ""); // Retirez l'extension du fichier

        nameElement.textContent = title; // Mettez à jour le contenu de l'élément avec le titre
    }
};

// Événement lorsque le chargement de la piste audio est terminé
audio.addEventListener("loadeddata", updateCurrentAudioTitle);

// Événement lorsque la piste audio change
audio.addEventListener("ended", updateCurrentAudioTitle);

// Lorsque la page est chargée, mettez à jour le titre de l'audio en cours de lecture
updateCurrentAudioTitle();


/* customControls */

const audioPlayer = document.querySelector(".audio-player");

audio.addEventListener(
    "loadeddata",
    () => {
        // Met à jour la durée totale de l'audio lorsqu'il est chargé
        audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
            audio.duration
        );
        audio.volume = 0.25; // Réglage initial du volume à 25%
    },
    false
);

// Cliquez sur la barre de temps pour avancer/reculer
const timeline = audioPlayer.querySelector(".timeline");
timeline.addEventListener("click", e => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
    audio.currentTime = timeToSeek;
}, false);

// Cliquez sur le curseur de volume pour changer le volume
const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
volumeSlider.addEventListener('click', e => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
}, false);

// Vérifie le pourcentage de l'audio et met à jour le temps en conséquence
setInterval(() => {
    const progressBar = audioPlayer.querySelector(".progress");
    progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
    audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
        audio.currentTime
    );
}, 500);

// Basculer entre la lecture et la pause lorsque le bouton est cliqué
const playBtn = audioPlayer.querySelector(".controls .toggle-play");
playBtn.addEventListener(
    "click",
    () => {
        if (audio.paused) {
            playBtn.classList.remove("play");
            playBtn.classList.add("pause");
            audio.play();
        } else {
            playBtn.classList.remove("pause");
            playBtn.classList.add("play");
            audio.pause();
        }
    },
    false
);

// Cliquez sur le bouton de volume pour activer/désactiver le son
audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
    const volumeEl = audioPlayer.querySelector(".volume-container .volume");
    audio.muted = !audio.muted;
    if (audio.muted) {
        volumeEl.classList.remove("icono-volumeMedium");
        volumeEl.classList.add("icono-volumeMute");
    } else {
        volumeEl.classList.add("icono-volumeMedium");
        volumeEl.classList.remove("icono-volumeMute");
    }
});

// Convertir 1 seconde en format 0:01
function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
        seconds % 60
    ).padStart(2, 0)}`;
}


/* autoSwitch */

function playNext() {
    const audio = document.getElementById('audio');
    const sources = audio.getElementsByTagName('source');

    // Recherche de la source actuelle
    let currentSourceIndex = -1;
    for (let i = 0; i < sources.length; i++) {
        if (sources[i].src === audio.src) {
            currentSourceIndex = i;
            break;
        }
    }

    // Calcul de l'index de la source suivante
    const nextSourceIndex = (currentSourceIndex + 1) % sources.length;

    // Mise à jour de la source audio et lecture
    audio.src = sources[nextSourceIndex].src;
    audio.load(); // Recharge le lecteur audio pour prendre en compte la nouvelle source
    audio.play(); // Lance la lecture de la nouvelle source
}

// Lancer la première piste audio
playNext();


/* downloadSoundActive */

// Récupérer tous les éléments audio de votre page
const audioElements = document.querySelectorAll('audio');
const downloadLink = document.querySelector('.download-link');

// Ajouter un gestionnaire d'événement pour chaque élément audio
audioElements.forEach(audio => {
    audio.addEventListener('play', () => {
        const audioSource = audio.src;
        downloadLink.href = audioSource;
    });
});


/* youtubePlaylist */

/*// Fonction appelée lorsque l'API YouTube est prête
function onYouTubeIframeAPIReady() {
    // Créer un lecteur
    var player = new YT.Player('player', {
        height: '0', // Pour masquer le lecteur
        width: '0', // Pour masquer le lecteur
        playerVars: {
            'autoplay': 1, // Lecture automatique
            'loop': 1, // Lecture en boucle
            'playsinline': 1, // Lecture inline (pour iOS)
            'showinfo': 0, // Information sur la vidéo cachées
            'listType': 'playlist', // Type de liste (playlist)
            'list': 'YOUR_PLAYLIST_ID' // ID de la playlist
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

// Fonction appelée lorsque le lecteur est prêt
function onPlayerReady(event) {
    // Lecture de la bande son de la playlist
    event.target.setVolume(25); // Réglez le volume à 100 (ou ajustez selon vos préférences)
    event.target.playVideo(); // Commencez à lire la vidéo
}*/


/* visualPlaylist */

const stage = document.querySelector('.stage');
const grid = document.querySelector('.grid');
const close = document.querySelector('.close');
let mPos = { x: 50, y: 50 };
let i = 0;

// Définition des extensions d'image supportées
const imageExtensions = ['.webp'];

// Récupérer l'URL de l'image en fonction de l'ID
function getImageURL(id) {
    for (let ext of imageExtensions) {
        const url = `assets/image/image${id}${ext}`;
        // Vérifie si l'image existe
        // Si elle existe, retourne l'URL
        if (checkImageExists(url)) {
            return url;
        }
    }
    // Si aucune image n'est trouvée, retourne une URL par défaut
    return 'assets/image/default.webp'; // Vous pouvez définir une image par défaut
}

// Vérifier si l'image existe
function checkImageExists(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();
    return xhr.status !== 404;
}

// Création des points sur la grille
for (let y = 1; y < 10; y++)
    for (let x = 1; x < 10; x++) {
        i++;
        makePt(x * 10, y * 10);
    }

// Fonction pour créer un point
function makePt(x, y) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); // Création d'un élément <g> (groupe SVG)
    const img = document.createElementNS("http://www.w3.org/2000/svg", "image"); // Création d'un élément <image> (image SVG)
    const depth = gsap.utils.random(0.8, 1); // Profondeur aléatoire du point
    grid.append(g); // Ajout du groupe à la grille
    g.appendChild(img); // Ajout de l'image au groupe
    gsap.set(g, { x: x, y: y, attr: { class: 'pt' }, svgOrigin: '50 50', scale: depth }); // Positionnement du groupe sur la grille et définition de la profondeur
    gsap.set(img, { attr: { class: 'img', id: 'img' + i, 'href': getImageURL(i) } }); // Attribution des attributs de l'image et de l'URL
    gsap.to(img, { duration: 0.5, x: -7, y: -7, attr: { width: 14, height: 14 } }); // Animation de l'image
    // Événements de la souris sur l'image
    img.onpointerenter = (e) => {
        gsap.to('.tip', { duration: 0.3, ease: 'power3', scale: 1 }); // Animation de l'infobulle lors du survol
        gsap.set('.tip text', { innerHTML: 'Souvenir ' + img.id.substring(3) }); // Affichage du numéro de l'image dans l'infobulle
    };
    img.onpointerleave = (e) => {
        gsap.to('.tip', { duration: 0.3, ease: 'power3.inOut', scale: 0 }); // Animation de l'infobulle lors du départ
    };
    img.onpointerup = (e) => {
        // Animation lors du clic sur l'image
        gsap.timeline()
            .set('.hero image', {
                attr: {
                    width: 94,
                    height: 94,
                    x: 3, y: 3,
                    href: img.getAttribute('href').replace('400/400', '1200/1200') // Remplacement de l'URL pour une image de plus grande taille
                }
            }, 0)
            .to('.tip', { ease: 'power3.inOut', scale: 0 }, 0) // Animation de l'infobulle
            .to('.img', { opacity: 0 }, 0) // Animation de l'opacité des images
            .to('.hero', { autoAlpha: 1 }, 0.5); // Animation de l'apparition de l'élément .hero
    };
}

// Fermeture de l'élément .hero
close.onpointerup = (e) => {
    gsap.timeline()
        .to('.hero', { autoAlpha: 0 }, 0) // Animation de la disparition de l'élément .hero
        .set('.hero image', { attr: { href: '' } }, 0.5) // Réinitialisation de l'URL de l'image
        .to('.img', { opacity: 1 }, 0.5); // Animation de l'opacité des images
};

// Redessin des points
function redraw(t) {
    const img = t.querySelector('image'); // Sélection de l'image dans le groupe
    const x = gsap.getProperty(t, 'x'); // Récupération de la position x du groupe
    const y = gsap.getProperty(t, 'y'); // Récupération de la position y du groupe
    const dist = Math.abs(x - mPos.x) + Math.abs(y - mPos.y); // Calcul de la distance entre le point et la position de la souris
    // Animation du redessin du point
    gsap.to(img, {
        duration: 0.7,
        scale: Math.max(1 - dist / 100, 0),
        attr: { x: x - mPos.x, y: y - mPos.y }
    });
}

// Suivi du mouvement de la souris
window.onpointermove = (e) => {
    const domPt = new DOMPoint(e.x, e.y); // Création d'un point DOM à la position de la souris
    let svgPt = domPt.matrixTransform(stage.getScreenCTM().inverse()); // Transformation du point DOM en coordonnées SVG
    gsap.set(mPos, { x: svgPt.x, y: svgPt.y }); // Mise à jour de la position de la souris
    gsap.to('.tip', { x: e.x, y: e.y, ease: 'expo' }); // Animation de l'infobulle
    pts.forEach(redraw); // Redessin de tous les points
};

const pts = document.querySelectorAll('.pt'); // Sélection de tous les points
gsap.to(mPos, { duration: 1, ease: 'expo.in', x: 50, y: 50, onUpdate: () => { pts.forEach(redraw); } }); // Animation de la position initiale de la souris

// Initialisation de l'infobulle et du bouton de fermeture
gsap.set('.tip', { scale: 0, transformOrigin: '0 15px', pointerEvents: 'none' }); // Initialisation de l'infobulle
gsap.set('.tip *', { y: -50, xPercent: -50 }); // Positionnement du contenu de l'infobulle
gsap.set('.close', { x: 93, y: 2 }); // Positionnement du bouton de fermeture
gsap.set('.hero', { autoAlpha: 0 }); // Initialisation de l'élément .hero


/* downloadPictureActive */

// Activation/Désactivation du bouton de télechargement dynamique du contenu de la visionneuse
document.addEventListener("DOMContentLoaded", function() {
    // Sélectionnez toutes les images dans l'élément avec la classe "hero"
    const images = document.querySelectorAll(".hero image");
    images.forEach(image => {
        // Ajoutez un gestionnaire d'événement pour chaque image lorsqu'elle est cliquée
        image.addEventListener("click", () => {
            // Affichez le bouton de téléchargement lorsqu'une image est cliquée
            const downloadBtn = document.getElementById("download-btn");
            downloadBtn.style.display = "block";
            
            // Ajoutez un gestionnaire d'événement pour le bouton de fermeture
            const closeButton = document.querySelector(".close");
            closeButton.addEventListener("click", () => {
                // Masquez le bouton de téléchargement lorsque le bouton de fermeture est cliqué
                downloadBtn.style.display = "none";
            });
        });
    });

    // Gestion du clic sur le bouton de téléchargement
    const downloadBtn = document.getElementById("download-btn");
    // Téléchargement dynamique du contenu de la visionneuse
    downloadBtn.addEventListener("click", () => {
        // Sélectionnez l'image affichée dans l'élément avec la classe "hero"
        const image = document.querySelector(".hero image");

        // Créez un lien de téléchargement pour l'image
        const link = document.createElement('a');
        link.href = image.getAttribute('href'); // Obtenez l'URL de l'image
        link.download = 'image'; // Définissez le nom de fichier pour le téléchargement

        // Simulez un clic sur le lien pour déclencher le téléchargement
        link.click();
    });
});