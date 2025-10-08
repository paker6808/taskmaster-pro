namespace taskmaster_pro.Application.Parameters
{
    public class Column // Represents a column in a table or grid that can be sorted.
    {
        public string Data { get; set; } // The data value to display in this column. This could be the name of a field in a database table, for example.

        public string Name { get; set; } // A human-readable name for this column. This will be displayed in the user interface.

        public bool Orderable { get; set; } // Indicates whether the user can sort the data in this column. If true, the application should provide a way for users to click on the column header to sort the data in ascending or descending order.
    }
}
