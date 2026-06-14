window.addEventListener("DOMContentLoaded", () => {

    if(typeof gsap !== "undefined"){

        gsap.from(".hero-title",{
            y:100,
            opacity:0,
            duration:1.8,
            ease:"power4.out"
        });

        gsap.from(".hero-subtitle",{
            y:50,
            opacity:0,
            duration:1.5,
            delay:0.5
        });

        gsap.from(".left",{
            x:-150,
            opacity:0,
            duration:1.2,
            scrollTrigger:{
                trigger:".left",
                start:"top 80%"
            }
        });

        gsap.from(".right",{
            x:150,
            opacity:0,
            duration:1.2,
            scrollTrigger:{
                trigger:".right",
                start:"top 80%"
            }
        });

    }

    const spotlight = document.querySelector(".spotlight");

    if(spotlight){

        document.addEventListener("mousemove",(e)=>{

            spotlight.style.left = e.clientX + "px";
            spotlight.style.top = e.clientY + "px";

        });

    }

});
const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = {
        name: form.querySelectorAll("input")[0].value,
        email: form.querySelectorAll("input")[1].value,
        event: form.querySelectorAll("input")[2].value,
        phone: form.querySelectorAll("input")[3].value,
        location: form.querySelectorAll("input")[4].value,
        message: form.querySelector("textarea").value
    };

   try {

    await fetch(
        "https://script.google.com/macros/s/AKfycbwDiwmRsbARz7x3RpY-jNXR-yCvQrASXnJBiSfAL54p2H4YKibyma3A6qVesMmYT9dCrA/exec",
        {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        }
    );

    const msg = document.getElementById("successMsg");

    msg.textContent =
    "✓ Thank you for contacting DIOD Studio. We've received your message and will contact you shortly.";

    msg.classList.add("show");

    form.reset();

} catch (error) {

    const msg = document.getElementById("successMsg");

    msg.textContent =
    "✗ Something went wrong. Please try again.";

    msg.classList.add("show");
}

});