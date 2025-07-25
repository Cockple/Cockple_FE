import Picker from "./Picker";

export interface RenderPickerGroupItem {
  options: string[];
  selected: string;
  setSelected: (v: string) => void;
}

export default function RenderPickerGroup(items: RenderPickerGroupItem[]) {
  return items.map((item, index) => (
    <div key={index} className="w-1/3 z-20">
      <Picker
        options={item.options}
        selectedValue={item.selected}
        onChange={item.setSelected}
      />
    </div>
  ));
}
