import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';


// Import PrimeNG modules as needed
import { BadgeModule } from 'primeng/badge';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { PasswordModule } from 'primeng/password';
import { EditorModule } from 'primeng/editor';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SpinnerModule } from 'primeng/spinner';
import { ListboxModule } from 'primeng/listbox';
import { ChipsModule } from 'primeng/chips';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
    declarations: [],

  imports: [
    AccordionModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    RadioButtonModule,
    SliderModule,
    RatingModule,
    PasswordModule,
    //EditorModule,
    AutoCompleteModule,
    SpinnerModule,
    ListboxModule,
    ChipsModule,
    ColorPickerModule,
    DialogModule,
    TooltipModule,
    MessagesModule,
    TableModule,
    OrganizationChartModule,
    BadgeModule,
    ToastModule,
    StepsModule,
    ConfirmDialogModule,
    PaginatorModule,
    InputNumberModule,
    ToggleButtonModule,
    InputSwitchModule,
    PanelMenuModule,
    InputMaskModule
    //Add more modules as needed
    ],

  exports: [
    AccordionModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    RadioButtonModule,
    SliderModule,
    RatingModule,
    PasswordModule,
    //EditorModule,
    AutoCompleteModule,
    SpinnerModule,
    ListboxModule,
    ChipsModule,
    ColorPickerModule,
    DialogModule,
    TooltipModule,
    MessagesModule,
    TableModule,
    OrganizationChartModule,
    BadgeModule,
    ToastModule,
    StepsModule,
    ConfirmDialogModule,
    PaginatorModule,
    InputNumberModule,
    ToggleButtonModule,
    InputSwitchModule,
    PanelMenuModule,
    InputMaskModule
        // Add more modules as needed
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ConfirmationService,MessageService],
})

export class PrimeConfig { }
