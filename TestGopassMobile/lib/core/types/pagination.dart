class PaginationOptions {
  final int? page;
  final int? limit;

  const PaginationOptions({this.page, this.limit});

  Map<String, String> toQueryParams() {
    final params = <String, String>{};
    if (page != null) params['page'] = page.toString();
    if (limit != null) params['limit'] = limit.toString();
    return params;
  }
}

class PaginatedResult<T> {
  final List<T> data;
  final int total;
  final int page;
  final int limit;
  final bool hasMore;
  final int totalPages;

  const PaginatedResult({
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
    required this.hasMore,
    required this.totalPages,
  });

  factory PaginatedResult.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>) fromJsonT,
  ) {
    final dataList = json['data'];
    final List<T> parsedData = dataList is List 
        ? dataList.map((e) => fromJsonT(e as Map<String, dynamic>)).toList()
        : <T>[];
    
    return PaginatedResult(
      data: parsedData,
      total: (json['total'] as num?)?.toInt() ?? 0,
      page: (json['page'] as num?)?.toInt() ?? 1,
      limit: (json['limit'] as num?)?.toInt() ?? 10,
      hasMore: json['hasMore'] as bool? ?? false,
      totalPages: (json['totalPages'] as num?)?.toInt() ?? 1,
    );
  }
}

const int defaultPage = 1;
const int defaultLimit = 10;
