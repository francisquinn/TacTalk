package com.example.tactalk;

import android.util.SparseArray;
import android.util.SparseIntArray;
import android.view.View;
import androidx.databinding.DataBinderMapper;
import androidx.databinding.DataBindingComponent;
import androidx.databinding.ViewDataBinding;
import com.example.tactalk.databinding.FragmentRecordingPageBindingImpl;
import com.example.tactalk.databinding.FragmentStatisticsBindingImpl;
import com.example.tactalk.databinding.FragmentUserPageBindingImpl;
import java.lang.IllegalArgumentException;
import java.lang.Integer;
import java.lang.Object;
import java.lang.Override;
import java.lang.RuntimeException;
import java.lang.String;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class DataBinderMapperImpl extends DataBinderMapper {
  private static final int LAYOUT_FRAGMENTRECORDINGPAGE = 1;

  private static final int LAYOUT_FRAGMENTSTATISTICS = 2;

  private static final int LAYOUT_FRAGMENTUSERPAGE = 3;

  private static final SparseIntArray INTERNAL_LAYOUT_ID_LOOKUP = new SparseIntArray(3);

  static {
    INTERNAL_LAYOUT_ID_LOOKUP.put(com.example.tactalk.R.layout.fragment_recording_page, LAYOUT_FRAGMENTRECORDINGPAGE);
    INTERNAL_LAYOUT_ID_LOOKUP.put(com.example.tactalk.R.layout.fragment_statistics, LAYOUT_FRAGMENTSTATISTICS);
    INTERNAL_LAYOUT_ID_LOOKUP.put(com.example.tactalk.R.layout.fragment_user_page, LAYOUT_FRAGMENTUSERPAGE);
  }

  @Override
  public ViewDataBinding getDataBinder(DataBindingComponent component, View view, int layoutId) {
    int localizedLayoutId = INTERNAL_LAYOUT_ID_LOOKUP.get(layoutId);
    if(localizedLayoutId > 0) {
      final Object tag = view.getTag();
      if(tag == null) {
        throw new RuntimeException("view must have a tag");
      }
      switch(localizedLayoutId) {
        case  LAYOUT_FRAGMENTRECORDINGPAGE: {
          if ("layout/fragment_recording_page_0".equals(tag)) {
            return new FragmentRecordingPageBindingImpl(component, view);
          }
          throw new IllegalArgumentException("The tag for fragment_recording_page is invalid. Received: " + tag);
        }
        case  LAYOUT_FRAGMENTSTATISTICS: {
          if ("layout/fragment_statistics_0".equals(tag)) {
            return new FragmentStatisticsBindingImpl(component, view);
          }
          throw new IllegalArgumentException("The tag for fragment_statistics is invalid. Received: " + tag);
        }
        case  LAYOUT_FRAGMENTUSERPAGE: {
          if ("layout/fragment_user_page_0".equals(tag)) {
            return new FragmentUserPageBindingImpl(component, view);
          }
          throw new IllegalArgumentException("The tag for fragment_user_page is invalid. Received: " + tag);
        }
      }
    }
    return null;
  }

  @Override
  public ViewDataBinding getDataBinder(DataBindingComponent component, View[] views, int layoutId) {
    if(views == null || views.length == 0) {
      return null;
    }
    int localizedLayoutId = INTERNAL_LAYOUT_ID_LOOKUP.get(layoutId);
    if(localizedLayoutId > 0) {
      final Object tag = views[0].getTag();
      if(tag == null) {
        throw new RuntimeException("view must have a tag");
      }
      switch(localizedLayoutId) {
      }
    }
    return null;
  }

  @Override
  public int getLayoutId(String tag) {
    if (tag == null) {
      return 0;
    }
    Integer tmpVal = InnerLayoutIdLookup.sKeys.get(tag);
    return tmpVal == null ? 0 : tmpVal;
  }

  @Override
  public String convertBrIdToString(int localId) {
    String tmpVal = InnerBrLookup.sKeys.get(localId);
    return tmpVal;
  }

  @Override
  public List<DataBinderMapper> collectDependencies() {
    ArrayList<DataBinderMapper> result = new ArrayList<DataBinderMapper>(1);
    result.add(new androidx.databinding.library.baseAdapters.DataBinderMapperImpl());
    return result;
  }

  private static class InnerBrLookup {
    static final SparseArray<String> sKeys = new SparseArray<String>(4);

    static {
      sKeys.put(0, "_all");
      sKeys.put(1, "recordViewModel");
      sKeys.put(2, "statsViewModel");
      sKeys.put(3, "userViewModel");
    }
  }

  private static class InnerLayoutIdLookup {
    static final HashMap<String, Integer> sKeys = new HashMap<String, Integer>(3);

    static {
      sKeys.put("layout/fragment_recording_page_0", com.example.tactalk.R.layout.fragment_recording_page);
      sKeys.put("layout/fragment_statistics_0", com.example.tactalk.R.layout.fragment_statistics);
      sKeys.put("layout/fragment_user_page_0", com.example.tactalk.R.layout.fragment_user_page);
    }
  }
}
