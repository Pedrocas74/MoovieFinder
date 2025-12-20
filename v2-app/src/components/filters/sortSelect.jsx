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
        <MenuItem value="recent">Recent</MenuItem>
        <MenuItem value="oldest">Oldest</MenuItem>

        <MenuItem value="rating_desc">Most rated</MenuItem>
        <MenuItem value="rating_asc">Lowest rated</MenuItem>

        {/* optional explicit direction naming if you still want it */}
        <MenuItem value="crescent">Crescent (A→Z / low→high)</MenuItem>
        <MenuItem value="decrescent">Decrescent (Z→A / high→low)</MenuItem>
      </Select>
    </FormControl>
  );
}
