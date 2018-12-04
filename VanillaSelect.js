class VanillaSelect {

    /*
     * <div class="col-4">
     *  <input id="p" class='form-control ___select-icon-input'>
     *  <label for="p"><img src="caret-down-solid.svg" class='___select-caret-down-icon'></label>
     * </div>
     */
    constructor(id) {
        this._originalSelect = document.getElementById(id);
        if (this._originalSelect === null) return;

        this._originalSelect.style.display = 'visible';

        this._divParent = document.createElement('div');

        this._divParent.classList = 'col-sm-4 nopadding';

        this._input = document.createElement('input');
        this._input.classList = __tc.INPUT;
        this._input.id = '___select' + Math.random().toString(36).substring(7);
        this._divParent.appendChild(this._input);

        this._label = document.createElement('label');
        this._label.setAttribute('for', this._input.id);
        this._divParent.appendChild(this._label);

        this._img = document.createElement('img');
        this._img.src = 'caret-down-solid.svg';
        this._img.classList = __tc.ICON;
        this._label.appendChild(this._img);

        this._originalSelect.parentNode.insertBefore(this._divParent, this._originalSelect);

        this._allOptions = document.createElement('div');
        this._allOptions.classList = __tc.OPTIONS;
        this._divParent.appendChild(this._allOptions);

        let options = this._originalSelect.querySelectorAll('option');
        let total = options.length;
        for (let i = 0; i < total; i++) {
            // console.log(options[i].classList.add('list-group-item'));
            // options[i].classList.add(tc_.OPTIONITEM);
            this._allOptions.appendChild(options[i]);
        }

        this._input.onkeydown = () => this._analiseEvent();
        window.addEventListener('click', (e) => this._click(e));

    }

    _click(e) {
        if(this._input.contains(e.target)) {//input clicked
            if(this.isVisible()) {
                this.hide();
            } else {
                this.show();
            }
        } else if(!this._allOptions.contains(e.target)) {//click outside options
            this.hide(this._allOptions);
        } else if(this._allOptions.contains(e.target)) {
            this.hide(this._allOptions);
            this._selectElement(e.target);
        }
    }

    _analiseEvent() {
        let e = window.event;
        let element = null;

        if (e.key === 27) {//esc
            this.hide(this._allOptions);
            this._selectedIndex = null;
            return;
        }

        if(e.key === 38) {//up
            if (this._selectedIndex === null) {
                this._selectedIndex = 0;
            } else {
                --this._selectedIndex;
            }
            element = this._getElement(this._selectedIndex);
        }

        if (e.key === 40) {//down
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

        
        // if(e.key === 13 && this._selectedIndex) {//enter
        //     this._selectElement 
        // }
        console.log(element);
    }

    hide() {
        this._allOptions.classList.add(__tc.HIDE);
    }

    show() {
        this._allOptions.classList.remove(__tc.HIDE);
    }

    isVisible() {
        return !this._allOptions.classList.contains(__tc.HIDE);
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
    ROOT: '___select-root',
    OPTIONS: '___select-all-options ___select-hide',
    OPTIONITEM: '',
    ICON: '___select-caret-down-icon',
    INPUT: 'form-control ___select-icon-input',
    HIDE: '___select-hide'
    // WRAPPER_IMG: '___wrapper ___img'
};
Object.freeze(__tc);