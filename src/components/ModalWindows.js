var ModalWindows = {
    showModal(message, status) {  // Status - Warning message or success? Warning - false. Success - true.
        this.deleteModals();

        let modalWindow = document.createElement('div');
        modalWindow.className = "modalWindow";
        modalWindow.classList.add(status ? "Success" : "Error");
        document.body.appendChild(modalWindow);

        let modalTitle = document.createElement('p');
        modalTitle.className = "modalTitle";
        modalTitle.textContent = status ? "Успешно!" : "Ошибка!";
        modalWindow.appendChild(modalTitle);

        let modalCloseIcon = document.createElement('img');
        modalCloseIcon.className = "modalCloseIcon";
        modalCloseIcon.src = "icons/close.png";
        modalWindow.appendChild(modalCloseIcon);

        modalCloseIcon.addEventListener("click", () => {
            modalWindow.remove();
        })

        let modalContent = document.createElement('div');
        modalContent.className = "modalContent";
        modalWindow.appendChild(modalContent);

        let modalIcon = document.createElement('img');
        modalIcon.className = "modalIcon";
        modalIcon.src = status ? "icons/success.svg" : "icons/warning.svg";
        modalContent.appendChild(modalIcon);

        let modalMessage = document.createElement('span');
        modalTitle.className = "modalTitle";
        modalMessage.textContent = message;
        modalContent.appendChild(modalMessage);
    },

    deleteModals() {
        let modalWindows = document.querySelectorAll('.modalWindow'); // Prevent spam modals
        for (let i = 0; i < modalWindows.length; i++) {
            modalWindows[i].remove();
        }
    }
}

export default ModalWindows