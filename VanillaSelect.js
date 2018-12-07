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

        this._originalSelect.classList.add(__tc.HIDE);

        this._divParent = document.createElement('div');

        this._divParent.classList = 'col-6 nopadding';

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

        this._allOptions = document.createElement('ul');
        this._allOptions.classList = __tc.OPTIONS;
        this._divParent.appendChild(this._allOptions);

        let options = this._originalSelect.querySelectorAll('option');
        let total = options.length;
        let htmlOptions = '';

        for (let i = 0; i < total; i++) {
            htmlOptions += `<li data-value='${options[i].value}'>${options[i].textContent}</li>`;
        }

        this._allOptions.innerHTML = htmlOptions;


        this._selectedIndex = null;

        this._addEventListeners();


    }

    _addEventListeners() {

        this._input.onkeydown = (event) => this._analiseEvent(event);
        this._input.onkeyup = (event) => {
            if(event.key === 'Control') {
                this._controlDown = false;
            }
        };
        window.addEventListener('click', (e) => this._click(e));
        this._allOptions.onmouseover = (event) => this._styleActiveElement(event.target);
    }

    _click(e) {
        if(e.button !== 0) return;
        if(this._input.contains(e.target)) {//input clicked
            if(this.isVisible()) {
                this.hide();
            } else {
                this.show();
            }
        } else if(!this._allOptions.contains(e.target)) {//click outside options
            this.hide();
        } else if(this._allOptions.contains(e.target)) {
            this.hide();
            this._selectElement(e.target);
            this._selectedIndex = this._getElementIndex(e.target);
        }
    }

    _styleActiveElement(e) {
        if(e.tagName.toLocaleLowerCase() !== 'li') {
            return;
        }

        //remove previous selected item
        let active = this._allOptions.querySelector(`.${__tc.ACTIVE}`);
        if(active) {
            active.classList.remove(__tc.ACTIVE);
        }

        //select current item
        e.classList.add(__tc.ACTIVE);
        this.__scrollToIfIsNotVisible(this._allOptions, e);
    }

    _analiseEvent(e) {
        e = e || window.event;
        // let element = this._getElement(this._selectedIndex);
        let element = null;


        if (e.key === 'Escape') {
            this.hide();
            // this._selectedIndex = null;
            return;
        }

       else if(e.key === 'ArrowUp') {
            if (this._selectedIndex === null) {
                this._selectedIndex = 0;
            } else {
                --this._selectedIndex;
            }
            element = this._getElement(this._selectedIndex);
        }

        else if (e.key === 'ArrowDown') {
            if (!this.isVisible()) {//show options
                this.show();
                // this._selectedIndex = 0;
                return;
            } else {//next selection
                if (this._selectedIndex === null) {
                    this._selectedIndex = 0;
                } else {
                    ++this._selectedIndex;
                }
            }
            element = this._getElement(this._selectedIndex);
        }

        else if(e.key === 'Control') {
            this._controlDown = true;
            return;
        }

        else if(this._controlDown && e.key === 'Home') {
            element = this._getElement(0);
        }

        else if(this._controlDown && e.key === 'End') {
            element = this._getElement(this._allOptions.querySelectorAll('li').length -1);
        }

        else if(e.key === 'Enter' && this._selectedIndex) {//enter
            element = this._getElement(this._selectedIndex);
        }

        else {
            return;
        }

        this._styleActiveElement(element);

        if(e.key === 'Enter') {
            this._selectElement(element);
            this.hide();
        }
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
        let elements = this._allOptions.querySelectorAll('li');

        if(index >= elements.length) {//returns last element
            this._selectedIndex = elements.length -1; 
            return elements[this._selectedIndex];
        } 
        else if(index < 0) {//returns first element
            this._selectedIndex = 0;
            return elements[this._selectedIndex];
        } else {//returns index element
            this._selectedIndex = index;
            return elements[index];
        }
    }

    _getElementIndex(e) {
        let elements = this._allOptions.querySelectorAll('li');
        let total = elements.length;
        for(let i = 0; i < total; i++) {
            if(e.dataset.value === elements[i].dataset.value) {
                return i;
            }
        }
    }

    _selectElement(e) {
        this._input.value = e.textContent;

        this._originalSelect.value = e.dataset.value;

        // let clone = element.cloneNode(true);
        // clone.setAttribute('selected', true);
        // this._originalSelect.appendChild(clone);
    }

    __scrollToIfIsNotVisible(parent, child) {
        // Where is the parent on page
        let parentRect = parent.getBoundingClientRect();

        // What can you see?
        let parentViewableArea = {
            height: parent.clientHeight,
            width: parent.clientWidth
        };

        // Where is the child
        let childRect = child.getBoundingClientRect();
            // console.log(childRect);
        // Is the child viewable?
        let isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parentViewableArea.height);

        // if you can't see the child try to scroll parent
        if (!isViewable) {


            // scroll by offset relative to parent
            //before scroll check if the bottom of child will be visible on next scroll
            if(parentRect.bottom - childRect.top < childRect.height) {
                parent.scrollTop = (childRect.bottom + parent.scrollTop) - parentRect.bottom
                // child.scrollIntoView(false);
            } else {

                // parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top
                child.scrollIntoView();
            }


        }
    }
}

let __tc = {
    ACTIVE: '___select-all-option-active',
    ROOT: '___select-root',
    OPTIONS: '___select-all-options ___select-hide',
    OPTIONITEM: '',
    ICON: '___select-caret-down-icon',
    INPUT: 'form-control ___select-icon-input',
    HIDE: '___select-hide',
};
Object.freeze(__tc);