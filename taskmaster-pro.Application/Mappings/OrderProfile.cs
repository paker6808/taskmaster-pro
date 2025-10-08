using taskmaster_pro.Application.Features.Orders.Queries.GetOrderById;
using taskmaster_pro.Application.Features.Orders.Queries.PagedOrders;

namespace taskmaster_pro.Application.Mappings
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<Order, GetOrdersViewModel>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ReverseMap();
            CreateMap<Order, OrderViewModel>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId));
            CreateMap<Order, PagedOrdersViewModel>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId));
        }
    }
}
