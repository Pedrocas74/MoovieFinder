import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function SourceSelect({ value, onChange, label = "Source" }) {
  return (
    <>
    <FormControl size="small" fullWidth>
      <InputLabel id="source-select-label">{label}</InputLabel>

      <Select
        labelId="source-select-label"
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="trending">Trending</MenuItem>
        <MenuItem value="popular">Popular</MenuItem>
      </Select>
    </FormControl>
    </>
  );
}
