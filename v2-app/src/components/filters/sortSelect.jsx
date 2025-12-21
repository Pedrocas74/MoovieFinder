import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function SortSelect({ value, onChange, label = "Sort" }) {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="sort-select-label">{label}</InputLabel>

      <Select
        labelId="sort-select-label"
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="" disabled>
          <em>Select sorting</em>
        </MenuItem>

        <MenuItem value="recent">Recent</MenuItem>
        <MenuItem value="oldest">Oldest</MenuItem>

        <MenuItem value="most_rated">Most rated</MenuItem>
        <MenuItem value="lowest_rated">Lowest rated</MenuItem>

        <MenuItem value="crescent">Crescent (A→Z)</MenuItem>
        <MenuItem value="decrescent">Decrescent (Z→A)</MenuItem>
      </Select>
    </FormControl>
  );
}
