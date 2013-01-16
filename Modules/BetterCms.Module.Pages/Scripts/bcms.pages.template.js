﻿/*jslint unparam: true, white: true, browser: true, devel: true */
/*global define, console */

define('bcms.pages.template', ['jquery', 'bcms', 'bcms.modal', 'bcms.datepicker', 'bcms.dynamicContent', 'bcms.siteSettings', 'bcms.messages', 'bcms.preview', 'bcms.grid', 'bcms.inlineEdit', 'slides.jquery'],
    function ($, bcms, modal, datepicker, dynamicContent, siteSettings, messages, preview, grid, editor) {
        'use strict';

        var template = {},
            links = {
                loadSiteSettingsTemplateListUrl: null,
                loadRegisterTemplateDialogUrl: null,
                loadEditTemplateDialogUrl: null,
                deleteTemplateUrl: null,
                loadTemplateRegionDialogUrl: null
            },
            globalization = {
                createTemplateDialogTitle: null,
                editTemplateDialogTitle: null,
                deleteTemplateConfirmMessage: null,
                deleteRegionConfirmMessage: null,
                editTemplateRegionTitle: null
            },
            selectors = {
                templatePreviewImageUrl: '#PreviewImageUrl',
                templatePreviewImage: '#bcms-template-preview-image',
                htmlContentTemplateRowTemplate: '#bcms-advanced-content-list-row-template',
                htmlContentTemplateRowTemplateFirstRow: 'tr:first',
                htmlContentTemplateTableFirstRow: 'table.bcms-tables > tbody > tr:first',

                templateSearchButton: '#bcms-template-search-btn',

                templateRegisterButton: '#bcms-register-template-button',
                templateRowEditButtons: '.bcms-grid-item-edit-button',

                templatesRowDeleteButtons: '.bcms-grid-item-delete-button',
                templateParentRow: 'tr:first',
                templateNameCell: '.bcms-template-name',
                templateRowDeleteButtons: '.bcms-grid-item-delete-button',
                templateRowTemplate: '#bcms-template-list-row-template',
                templateRowTemplateFirstRow: 'tr:first',
                templateTableFirstRow: 'table.bcms-tables > tbody > tr:first',
                templateInsertButtons: '.bcms-template-insert-button',

                addNewRegionButton: '#bcms-template-options-add-region',
                templatesListForm: '#bcms-templates-form',

                addOptionLink: '#bcms-add-option-button',
                optionsTable: '#bcms-options-grid'
            },
            classes = {
            };

        /**
        * Assign objects to module.
        */
        template.links = links;
        template.globalization = globalization;


        /**
        * Opens ServerControlWidget edit dialog.
        */
        template.openEditTemplateDialog = function (templateId, onSaveCallback) {
            modal.open({
                title: globalization.editTemplateDialogTitle,
                onLoad: function (childDialog) {
                    dynamicContent.bindDialog(childDialog, $.format(links.loadEditTemplateDialogUrl, templateId), {
                        contentAvailable: initializeEditTemplateForm,

                        beforePost: function (form) {
                            editor.resetAutoGenerateNameId();
                            editor.setInputNames(form);
                        },

                        postSuccess: onSaveCallback
                    });
                }
            });
        };

        /**
        * Opens template create form from site settings template list
        */
        template.openRegisterTemplateDialog = function (onSaveCallback) {
            modal.open({
                title: globalization.createTemplateDialogTitle,
                onLoad: function (childDialog) {
                    dynamicContent.bindDialog(childDialog, links.loadRegisterTemplateDialogUrl, {
                        contentAvailable: initializeEditTemplateForm,

                        postSuccess: onSaveCallback
                    });
                }
            });
        };

        /**
        * Initializes template form
        */
        function initializeEditTemplateForm(dialog) {
            editor.initialize(dialog.container, {
                deleteRowMessageExtractor: function () {
                    return globalization.deleteRegionConfirmMessage;
                }
            });

            dialog.container.find(selectors.addOptionLink).on('click', function () {
                editor.addNewRow(dialog.container, $(selectors.optionsTable));
            });

            dialog.container.find(selectors.addNewRegionButton).on('click', function () {
                editor.addNewRow(dialog.container, $(selectors.optionsTable));
            });

            dialog.container.find(selectors.templatePreviewImageUrl).blur(function () {
                var url = dialog.container.find(selectors.templatePreviewImageUrl).val();
                var webSiteUrlExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;
                if (webSiteUrlExp.test(url)) {
                    dialog.container.find(selectors.templatePreviewImage).attr({
                        src: url
                    });
                } else {
                    dialog.container.find(selectors.templatePreviewImageUrl).val("");
                    dialog.container.find(selectors.templatePreviewImage).attr({
                        src: ""
                    });
                }
            });
        };

        /*
        * Open a template edit dialog by the specified tempalte type.
        */
        template.editTemplate = function (templateId, onSaveCallback) {
            template.openEditTemplateDialog(templateId, onSaveCallback);

        };

        /**
        * Deletes template.
        */
        template.deleteTemplate = function (templateId, templateVersion, templateName, onDeleteCallback) {
            var url = $.format(links.deleteTemplateUrl, templateId, templateVersion),
                message = $.format(globalization.deleteTemplateConfirmMessage, templateName),
                onDeleteCompleted = function (json) {
                    try {
                        if (json.Success && $.isFunction(onDeleteCallback)) {
                            onDeleteCallback(json);
                        }
                    } finally {
                        confirmDialog.close();
                    }
                },
                confirmDialog = modal.confirm({
                    content: message,
                    onAccept: function () {
                        $.ajax({
                            type: 'POST',
                            url: url,
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            cache: false
                        })
                        .done(function (json) {
                            onDeleteCompleted(json);
                        })
                        .fail(function (response) {
                            onDeleteCompleted(bcms.parseFailedResponse(response));
                        });
                        return false;
                    }
                });
        };

        /**
        * Opens dialog for editing template options 
        */
        template.configureWidget = function (pageContentId, onSaveCallback) {
            modal.open({
                title: globalization.editTemplateRegionTitle,
                onLoad: function (dialog) {
                    var url = $.format(links.loadTemplateRegionDialogUrl, pageContentId);
                    dynamicContent.bindDialog(dialog, url, {
                        contentAvailable: function (contentDialog) {
                            editor.initialize(contentDialog.container, {});
                        },

                        postSuccess: function () {
                            if ($.isFunction(onSaveCallback)) {
                                onSaveCallback();
                            }
                        }
                    });
                }
            });
        };

        /**
        * Opens site settings template list dialog
        */
        template.loadSiteSettingsTemplateList = function () {
            dynamicContent.bindSiteSettings(siteSettings, links.loadSiteSettingsTemplateListUrl, {
                contentAvailable: initializeTemplatesList
            });
        };

        /**
        * Initializes site settings template list and list items
        */
        function initializeTemplatesList() {
            var dialog = siteSettings.getModalDialog(),
                container = dialog.container,
                onTemplateCreated = function (json) {
                    if (json.Success && json.Data != null) {
                        var rowtemplate = $(selectors.templateRowTemplate),
                            newRow = $(rowtemplate.html()).find(selectors.templateRowTemplateFirstRow);
                        setTemplateFields(newRow, json);
                        newRow.insertBefore($(selectors.templateTableFirstRow, container));
                        initializeTemplateListEvents(newRow);
                        grid.showHideEmptyRow(container);
                    }
                };

            var form = dialog.container.find(selectors.templatesListForm);
            grid.bindGridForm(form, function (data) {
                siteSettings.setContent(data);
                initializeTemplatesList();
            });

            form.on('submit', function (event) {
                event.preventDefault();
                searchTemplates(form);
                return false;
            });

            form.find(selectors.templateSearchButton).on('click', function () {
                searchTemplates(form);
            });

            container.find(selectors.templateRegisterButton).on('click', function () {
                template.openRegisterTemplateDialog(onTemplateCreated);
            });

            initializeTemplateListEvents(container);
        };

        /**
        * Search site settings template.
        */
        function searchTemplates(form) {
            grid.submitGridForm(form, function (data) {
                siteSettings.setContent(data);
                initializeTemplatesList();
            });
        };

        /**
        * Initializes site settings template list items.
        */
        function initializeTemplateListEvents(container) {
            container.find(selectors.templateRowEditButtons).on('click', function () {
                editTemplate(container, $(this));
            });

            container.find(selectors.templatesRowDeleteButtons).on('click', function () {
                deleteTemplates(container, $(this));
            });
        };

        /**
        * Calls function, which opens dialog for a template editing.
        */
        function editTemplate(container, self) {
            var row = self.parents(selectors.templateParentRow),
                id = row.data('id');

            template.editTemplate(id, function (data) {
                if (data.Data != null) {
                    setTemplateFields(row, data);
                    grid.showHideEmptyRow(container);
                }
            });
        };

        /**
        * Deletes template from site settings template list.
        */
        function deleteTemplates(container, self) {
            var row = self.parents(selectors.templateParentRow),
                id = row.data('id'),
                version = row.data('version'),
                name = row.find(selectors.templateNameCell).html();

            template.deleteTemplate(id, version, name, function (data) {
                messages.refreshBox(container, data);
                if (data.Success) {
                    row.remove();
                    grid.showHideEmptyRow(container);
                }
            });
        };

        /**
        * Set values, returned from server to row fields
        */
        function setTemplateFields(row, json) {
            row.data('id', json.Data.Id);
            row.data('version', json.Data.Version);
            row.find(selectors.templateNameCell).html(json.Data.TemplateName);
        };

        return template;
    });

