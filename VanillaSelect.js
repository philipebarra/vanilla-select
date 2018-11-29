class VanillaSelect {

    constructor(id) {
        this._originalSelect = document.getElementById(id);
        if (this._originalSelect === null) return;

        this._originalSelect.style.display = 'none';

        //inserting the table inside a div
        this._divParent = document.createElement('div');
        this._divParent.classList.add(__tc.DIV_CLASS);
        this._originalSelect.parentNode.insertBefore(this._divParent, this._originalSelect);

        this._input = document.createElement('input');
        this._input.type = 'text';
        this._input.autocomplete = 'off';
        this._input.classList = this._originalSelect.classList;
        this._divParent.appendChild(this._input);

        this._allOptions = document.createElement('div');
        this._allOptions.classList = `${__tc.ALL_OPTIONS}`;
        this._divParent.appendChild(this._allOptions);

        let options = this._originalSelect.querySelectorAll('option');
        let total = options.length;
        for (let i = 0; i < total; i++) {
            this._allOptions.appendChild(options[i]);
        }
        // this._divParent.appendChild(this._originalSelect);

        this._selectedIndex = null;
        this._selectedElement = null;


        this._input.onclick = () => this._click();
        this._input.onkeydown = () => this._analiseEvent();
    }

    _click() {
        if (!this.isVisible()) {//show options
            this.show(this._allOptions);
            this._selectedIndex = null;
        }
    }

    _analiseEvent() {
        let e = window.event;
        let element = null;

        if (e.keyCode === 27) {//esc
            this.hide(this._allOptions);
            this._selectedIndex = null;
            return;
        }

        if(e.keyCode === 38) {//up
            if (this._selectedIndex === null) {
                this._selectedIndex = 0;
            } else {
                --this._selectedIndex;
            }
            element = this._getElement(this._selectedIndex);
        }

        if (e.keyCode === 40) {//down
            if (!this.isVisible()) {//show options
                this.show(this._allOptions);
                this._selectedIndex = null;
            } else {//next selection
                if (this._selectedIndex === null) {
                    this._selectedIndex = 0;
                } else {
                    ++this._selectedIndex;
                }
                element = this._getElement(this._selectedIndex);
            }
        }

        
        // if(e.keyCode === 13 && this._selectedIndex) {//enter
        //     this._selectElement 
        // }
        console.log(element);
    }

    hide() {
        this._allOptions.classList.remove(__tc.VISIBLE);
        this._allOptions.classList.add(__tc.HIDDE);
    }

    show() {
        this._allOptions.classList.remove(__tc.HIDDE);
        this._allOptions.classList.add(__tc.VISIBLE);
    }

    isVisible() {
        return this._allOptions.classList.contains(__tc.VISIBLE);
    }

    _getElement(index) {
        let elements = this._allOptions.querySelectorAll('option');
        
        if(index >= elements.length) {
            this._selectedIndex = elements.length -1; 
            return elements[this._selectedIndex];
        } 
        else if(index < 0) {
            this._selectedIndex = 0;
            return elements[this._selectedIndex];
        } else {
            return elements[index];
        }
    }

    _selectElement(element) {
        this._input.value = element.textContent;

        this._originalSelect.innerHTML = '';

        let clone = element.cloneNode(true);
        clone.setAttribute('selected', true);
        this._originalSelect.appendChild(clone);
    }
}

//Table constants
let __tc = {
    DIV_CLASS: '___select',//div that wraps the table
    ALL_OPTIONS: '___all_options ___select_hidde',
    VISIBLE: '___select_visible',
    HIDDE: '___select_hidde',
};
Object.freeze(__tc);