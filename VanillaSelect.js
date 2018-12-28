class VanillaSelect {

    constructor(id) {
        this._originalSelect = document.getElementById(id);
        if (this._originalSelect === null) return;

        this._selectedIndex = null;

        this._data = [];

        this._createElements();
        this._addEventListeners();
    }

    /*
     * <div class="col-4">
     *  <input id="p" class='form-control ___select-icon-input'>
     *  <label for="p"><img src="caret-down-solid.svg" class='___select-caret-down-icon'></label>
     *  <ul>
     *      <li data-value=""></li>
     *  </ul>
     * </div>
     */
    _createElements() {
        this._originalSelect.classList.add(__tc.HIDE);
        this._divParent = document.createElement('div');
        this._divParent.classList = __tc.ALL_OPTIONS;

        this._input = document.createElement('input');
        this._input.classList = __tc.INPUT;
        this._input.id = '___select' + Math.random().toString(36).substring(7);
        this._divParent.appendChild(this._input);

        this._label = document.createElement('label');
        this._label.setAttribute('for', this._input.id);
        this._divParent.appendChild(this._label);

        this._img = document.createElement('i');
        this._img.innerHTML = '&#9660;';//caret down
        this._img.classList = __tc.ICON;
        this._label.appendChild(this._img);

        this._originalSelect.parentNode.insertBefore(this._divParent, this._originalSelect);

        this._allOptions = document.createElement('ul');
        this._allOptions.classList = __tc.OPTIONS;
        this._divParent.appendChild(this._allOptions);
        this._timeout;

        this._loadElements();
    }

    _loadElements() {
        let options = this._originalSelect.querySelectorAll('option');
        let total = options.length;
        let htmlOptions = '';

        for (let i = 0; i < total; i++) {
            this._data.push(new Data(
                options[i].textContent,
                options[i].value,
                VanillaSelect._convertLetter(options[i].textContent).toLocaleLowerCase()
            ));
            htmlOptions += `<li data-value='${options[i].value}'>${options[i].textContent}</li>`;
        }

        this._allOptions.innerHTML = htmlOptions;
        this._optionsLi = this._allOptions.querySelectorAll('li');
    }

    _addEventListeners() {

        this._input.onkeydown = (event) => this._analiseEvent(event);
        this._input.onkeyup = (e) => {
            if (e.key === 'Control') {
                this._controlDown = false;
            }
            //do nothing
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') { }
            else {
                //debounce (wait 500 ms to search)
                clearTimeout(this._timeout);
                this._timeout = setTimeout(() => { this._search(); }, 500);
            }
        };
        document.addEventListener('click', (e) => this._click(e));
        this._allOptions.onmouseover = (event) => {
            this._styleWithMouse(event.target);
        }
    }

    _click(e) {
        if (e.button !== 0) return;
        if (this._input.contains(e.target)) {//input clicked
            this.toggle();
        }
        else if (this._img.contains(e.target)) { }//crazy behavior
        else if (!this._allOptions.contains(e.target)) {//click outside options
            this.hide();
        } else if (this._allOptions.contains(e.target)) {
            this._selectElement(e.target).hide();
            this._selectedIndex = this._getElementIndex(e.target);
        }
    }


    _styleWithMouse(e) {
        if(e.tagName.toLocaleLowerCase() !== 'li')//mouse over scrollbar for ex
            return;

        //remove previous selected item
        let active = document.querySelector(`.${__tc.ACTIVE}`);

        if (active) {
            active.classList.remove(__tc.ACTIVE);
        }

        e.classList.add(__tc.ACTIVE);
    }

    _styleActiveElement(e) {
        //remove previous selected item
        let active = document.querySelector(`.${__tc.ACTIVE}`);
        
        if (active) {
            active.classList.remove(__tc.ACTIVE);
        }
        
        //select current item
        this._allOptions.querySelectorAll('li').item(this._selectedIndex).classList.add(__tc.ACTIVE);
        VanillaSelect.__scrollToIfIsNotVisible(this._allOptions, e);
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

        else if (e.key === 'ArrowUp') {
            
            this._nextActiveElement('up');

            element = this._getElement(this._selectedIndex);
        }

        else if (e.key === 'ArrowDown') {
            if (!this.isVisible()) {//show options
                this.show();
                // this._selectedIndex = 0;
                return;
            } else {//next selection

                this._nextActiveElement('down');
            }
            element = this._getElement(this._selectedIndex);
        }

        else if (e.key === 'Control') {
            this._controlDown = true;
            return;
        }

        else if (this._controlDown && e.key === 'Home') {
            element = this._getElement(0);
        }

        else if (this._controlDown && e.key === 'End') {
            element = this._getElement(this._optionsLi.length - 1);
        }

        else if (e.key === 'Enter' && this._selectedIndex) {//enter
            element = this._getElement(this._selectedIndex);
            console.log(this._selectedIndex, element);
        }

        else {
            return;
        }

        this._styleActiveElement(element);

        if (e.key === 'Enter') {
            this._selectElement(element).hide();
        }
    }

    _nextActiveElement(direction = 'down') {

        let total = this._allOptions.querySelectorAll('li').length;

        if(this._selectedIndex === null)
            return this._selectedIndex = 0;

        else if(direction === 'down') {
            return ((this._selectedIndex + 1) < total) ? ++this._selectedIndex : total;
        }
        else {
            return ((this._selectedIndex - 1) >= 0) ? --this._selectedIndex : 0;
        }
    }

    hide() {
        this._allOptions.classList.add(__tc.HIDE);
        this._img.innerHTML = '&#9660;';
    }

    show() {
        this._allOptions.classList.remove(__tc.HIDE);
        this._img.innerHTML = '&#9650;';
    }

    isVisible() {
        return !this._allOptions.classList.contains(__tc.HIDE);
    }

    toggle() {
        if (this.isVisible()) {
            this.hide();
        } else {
            this.show();
        }
    }

    _getElement(index) {

        console.log(index, this._optionsLi)

        if (index >= this._optionsLi.length) {//returns last element
            this._selectedIndex = this._optionsLi.length - 1;
            return this._optionsLi[this._selectedIndex];
        }
        else if (index < 0) {//returns first element
            this._selectedIndex = 0;
            return this._optionsLi[this._selectedIndex];
        } else {//returns index element
            this._selectedIndex = index;
            return this._optionsLi[index];
        }
    }

    _getElementIndex(e) {
        let total = this._optionsLi.length;
        for (let i = 0; i < total; i++) {
            if (e.dataset.value === this._optionsLi[i].dataset.value) {
                return i;
            }
        }
    }

    _selectElement(e) {
        this._input.value = e.textContent;
        this._originalSelect.value = e.dataset.value;
        return this;
    }

    _search() {
        let q = this._input.value;
        let len = q.length;
        let html = '';
        let total = this._data.length;
        this._selectedIndex = null;

        if (len === 0) {//the input was cleaned by user

            for (let i = 0; i < total; i++) {
                html += `<li data-value="${this._data[i].value}">${this._data[i].text}</li>`;
            }

            this._allOptions.innerHTML = html;
            return;
        }

        q = VanillaSelect._convertLetter(q).toLowerCase();

        for (let i = 0; i < total; i++) {

            let match = this._data[i].highlight(q);
            if (match)
                html += match;
        }
        this._allOptions.innerHTML = html;
    }

    static _convertLetter(str) {
        return str
            .replace(/[ÀÁÂÃÄÅ]/g, "A")
            .replace(/[ÈÉÊË]/g, "E")
            .replace(/[ÌÍÎÏ]/g, "I")
            .replace(/[ÒÓÔÖ]/g, "O")
            .replace(/[ÙÚÛÜ]/g, "U")
            .replace(/[Ç]/g, "C")
            .replace(/[àáâãäå]/g, "a")
            .replace(/[èéêë]/g, "e")
            .replace(/[ìíîï]/g, "i")
            .replace(/[òóôö]/g, "o")
            .replace(/[ùúûü]/g, "u")
            .replace(/[ç]/g, "c");
    }

    static __scrollToIfIsNotVisible(parent, child) {
        // Where is the parent on page
        let parentRect = parent.getBoundingClientRect();

        // What can you see?
        let parentViewableArea = {
            height: parent.clientHeight,
            width: parent.clientWidth
        };

        // Where is the child
        let childRect = child.getBoundingClientRect();
        // Is the child viewable?
        let isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parentViewableArea.height);

        // if you can't see the child try to scroll parent
        if (!isViewable) {

            // scroll by offset relative to parent
            //before scroll check if the bottom of child will be visible on next scroll
            if (parentRect.bottom - childRect.top < childRect.height) {
                parent.scrollTop = (childRect.bottom + parent.scrollTop) - parentRect.bottom
                // child.scrollIntoView(false);
            } else {

                // parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top
                child.scrollIntoView();
            }


        }
    }
}

class Data {
    constructor(text, value, searchble = null) {
        this._text = text;
        this._value = value;
        this._searchble = searchble;
    }

    highlight(q) {

        let matches = false, match = 0, html = this._text, htmlSearch = this._searchble;

        while ((match = htmlSearch.indexOf(q, match)) !== -1) {

            //preserves original caption
            let htmlOld = html;
            html = htmlOld.substring(0, match);
            html += '<b>' + htmlOld.substr(match, q.length) + '</b>';
            html += htmlOld.substr(match + q.length);

            //convert everything to lower case to search
            let htmlLowerCase = htmlSearch;
            htmlSearch = htmlLowerCase.substring(0, match);
            htmlSearch += '<b>' + htmlLowerCase.substr(match, q.length) + '</b>';
            htmlSearch += htmlLowerCase.substr(match + q.length);

            matches = true;
            match += 7 + q.length;//7 = <b></b> and q.length = xxx (size of searched word)

            if (match >= 150) { //stop to search when count is 150 to make it fast
                break;
            }
        }

        return matches ? `<li data-value="${this._value}">${html}</li>` : null;
    }

    get text() {
        return this._text;
    }

    get value() {
        return this._value;
    }
}

let __tc = {
    ACTIVE: '___select-all-option-active',
    ALL_OPTIONS: 'col-6 nopadding',
    HIDE: '___select-hide',
    ICON: '___select-caret-down-icon',
    INPUT: 'form-control ___select-icon-input',
    ROOT: '___select-root',
    OPTIONS: '___select-all-options ___select-hide',
    OPTIONITEM: '',
};
Object.freeze(__tc);