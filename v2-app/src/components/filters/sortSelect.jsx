import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function SortSelect({ value, onChange, label = "Sort" }) {
  return (
    <FormControl
      sx={{
        minWidth: 80,
        maxWidth: 100,
        marginRight: "5%",
        maxHeight: 10,
    
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--clr-muted)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--clr-primary)",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "var(--clr-primary)",
          },

        "& .MuiSelect-select": {
          color: "var(--clr-text)",
        },

        "& .MuiInputLabel-root": {
          color: "var(--clr-muted)",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "var(--clr-primary)",
        },

        "& .MuiSvgIcon-root": {
          color: "var(--clr-muted)", 
        },

      }}
      size="small"
    >
      <InputLabel id="sort-select-label">{label}</InputLabel>

      <Select
        labelId="sort-select-label"
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: "var(--clr-bg)",
              color: "var(--clr-text)",
              border: "1px solid var(--clr-border)",
            },
          },
        }}
      >
        <MenuItem value="" disabled>
          <em>Select sorting</em>
        </MenuItem>

        <MenuItem value="recent">Recent </MenuItem>
        <MenuItem value="oldest">Oldest</MenuItem>

        <MenuItem value="most_rated">↑ Rate</MenuItem>
        <MenuItem value="lowest_rated">↓ Rate</MenuItem>

        <MenuItem value="crescent">A→Z</MenuItem>
        <MenuItem value="decrescent">Z→A</MenuItem>
      </Select>
    </FormControl>
  );
}
