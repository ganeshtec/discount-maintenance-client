describe('multiselect dropdown', function () {

    var $componentController, $filter;
    var ctrl, data;

    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    beforeEach(inject(function (_$componentController_, _$filter_) {
        $componentController = _$componentController_;
        $filter = _$filter_;
        data = {
            options: [{ "merchandiseSubordinateClassNumber": 1, "merchandiseSubordinateClassDescription": "TABLESET" }, { "merchandiseSubordinateClassNumber": 2, "merchandiseSubordinateClassDescription": "TABLESET" }],
            prefix: '',
            suffix: 'subclasses',
            label: 'merchandiseSubordinateClassNumber,merchandiseSubordinateClassDescription',
            labelDelimiter: '-',
            selectedOptions: [],
            notifyCompletion: '',
            preview: false

        }
        ctrl = $componentController('multiselectDropdown', null, data);
        ctrl.$onChanges(data);
    }));

    it('Test #$onChanges', function () {
        expect(ctrl.label.length).toEqual(2);
        expect(ctrl.labelDelimiter).toEqual('-');
        expect(ctrl.suffix).toEqual('subclasses');
        expect(ctrl.options.length).toEqual(2);
    });

    it('Test #selectionChanged', function () {
        ctrl.options[0].checked = true;
        ctrl.selectionChanged();
        expect(ctrl.selectedOptions.length).toEqual(1);
    });

    it('Test #getOptionLabel', function () {
        expect(ctrl.getOptionLabel(ctrl.options[0])).toEqual('1-TABLESET');
    });

});
