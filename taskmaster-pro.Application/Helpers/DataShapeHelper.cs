namespace taskmaster_pro.Application.Helpers
{
    public class DataShapeHelper<T> : IDataShapeHelper<T>
    {
        private readonly PropertyInfo[] _properties;

        public DataShapeHelper()
        {
            _properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        }

        public IEnumerable<IDictionary<string, object>> ShapeData(IEnumerable<T> entities, string fieldsString)
        {
            var requiredProps = GetRequiredProperties(fieldsString);
            return entities.Select(e => FetchDataForEntity(e, requiredProps)).ToList();
        }

        public async Task<IEnumerable<IDictionary<string, object>>> ShapeDataAsync(IEnumerable<T> entities, string fieldsString)
        {
            return await Task.Run(() => ShapeData(entities, fieldsString));
        }

        public IDictionary<string, object> ShapeData(T entity, string fieldsString)
        {
            var requiredProps = GetRequiredProperties(fieldsString);
            return FetchDataForEntity(entity, requiredProps);
        }

        private IEnumerable<PropertyInfo> GetRequiredProperties(string fieldsString)
        {
            if (string.IsNullOrWhiteSpace(fieldsString))
                return _properties;

            var fields = fieldsString.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                     .Select(f => f.Trim());

            return _properties.Where(p => fields.Contains(p.Name, StringComparer.InvariantCultureIgnoreCase));
        }

        private IDictionary<string, object> FetchDataForEntity(T entity, IEnumerable<PropertyInfo> requiredProps)
        {
            var dict = new Dictionary<string, object>();
            foreach (var prop in requiredProps)
                dict[prop.Name] = prop.GetValue(entity);

            return dict;
        }
    }
}
