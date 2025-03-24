import Widget from "@arcgis/core/widgets/Widget";
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import *  as widget from "@arcgis/core/widgets/support/widget"

@subclass("MapButtonWidget")
export default class MapButtonWidget extends Widget {
    @property() iconClass = 'esri-icon-map-pin';
    @property() override label = 'Custom Tool';
    @property() name = 'tool';

    private iconEl!: HTMLSpanElement;
    private _container = document.createElement("div");;
    private _onClick?: () => void;

    constructor(props?: any) {
        super(props);

        this._container.className = "esri-widget-button custom-icon-button";
    
        this.iconEl = document.createElement("span");
        this.iconEl.className = `esri-icon ${this.iconClass}`;
        this._container.appendChild(this.iconEl);

        this._container.title = this.label;
        this._onClick = props?.onClick;

        this._container.onclick = () => {
            if (this._onClick) {
              this._onClick();
            } else {
              console.log(`${this.label} clicked (no onClick assigned)`);
            }
          };
    
        this.container = this._container;
    }

    override postInitialize(): void {
        this.iconEl.className = this.iconClass;
        this._container.title = this.label;
        
        this.container = this._container;
    }

    override render() {
        return widget.tsx
    }


}