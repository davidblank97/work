<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <!-- Only including english since that is all that was available when the XSL was created. Need a way to handle different languages-->

  <xsl:template match="UnitData[@localeID='en-CA']/types/linear_speed/*[last()]">
    <xsl:copy-of select="."/>
    <metres_per_minute name="METRES PER MINUTE">
      <conversion>39.3701</conversion>
      <symbol>m/min</symbol>
    </metres_per_minute>
    <centimeters_per_minute name="CENTIMETERS PER MINUTE">
      <conversion>0.393701</conversion>
      <symbol>cm/min</symbol>
    </centimeters_per_minute>
    <millimeters_per_second name="MILLIMETERS PER SECOND">
      <conversion>2.3622</conversion>
      <symbol>mm/s</symbol>
    </millimeters_per_second>
    <millimeters_per_minute name="MILLIMETERS PER MINUTE">
      <conversion>0.0393701</conversion>
      <symbol>mm/min</symbol>
    </millimeters_per_minute>
  </xsl:template>

  <xsl:template match="UnitData[@localeID='en-CA']/types/heat_input/*[last()]">
    <xsl:copy-of select="."/>
    <kilojoules_per_centimeter name="KILOJOULES PER CENTIMETER">
      <conversion>2.54</conversion>
      <symbol>kJ/cm</symbol>
    </kilojoules_per_centimeter>
    <kilojoules_per_millimeter name="KILOJOULES PER MILLIMETER">
      <conversion>25.4</conversion>
      <symbol>kJ/mm</symbol>
    </kilojoules_per_millimeter>
  </xsl:template>

  <xsl:template match="UnitData[@localeID='en-CA']/types/resolution/*[last()]">
    <xsl:copy-of select="."/>
    <millivolts_per_millimeter name="MILLIVOLTS PER MILLIMETER">
				<conversion>0.0254</conversion>
				<symbol>mV/mm</symbol>
			</millivolts_per_millimeter>
			<volts_per_millimeter name="VOLTS PER MILLIMETER">
				<conversion>25.4</conversion>
				<symbol>V/mm</symbol>
			</volts_per_millimeter>
  </xsl:template>
  
  <xsl:template match="UnitData[@localeID='en-CA']/types/hotwire_rate/*[last()]">
    <xsl:copy-of select="."/>
    <amps_per_meter_per_minute name="AMPS PER METER PER MINUTE">
				<conversion>0.025399986</conversion>
				<symbol>A/m/min</symbol>
			</amps_per_meter_per_minute>
  </xsl:template>

  <xsl:template match="UnitData[@localeID='en-CA']/types/rotation_speed/rotations_per_minute/symbol">
    <symbol>1/min</symbol>
  </xsl:template>

  <xsl:template match="UnitData[@localeID='en-CA']/types/frequency/kilohertz/symbol">
    <symbol>kHz</symbol>
  </xsl:template>

  <xsl:template match="UnitData[@localeID='en-CA']/types/flow/liters_per_hour/symbol">
    <symbol>l/h</symbol>
  </xsl:template>

  <xsl:template match="UnitData[@localeID='en-CA']/types/flow/liters_per_minute/symbol">
    <symbol>l/min</symbol>
  </xsl:template>

  <xsl:template match="UnitData[@localeID='en-CA']/types/amps_rate/amps_per_ms/symbol">
    <symbol>A/ms</symbol>
  </xsl:template>

  <xsl:template match="UnitData[@localeID='en-CA']/types/volts_rate/volts_per_ms/symbol">
    <symbol>V/ms</symbol>
  </xsl:template>

  <xsl:template match="UnitData[@localeID='en-CA']/types/hotwire_rate/amps_per_ipm/symbol">
    <symbol>A/IPM</symbol>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>