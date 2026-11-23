<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="system_user_units/defaults/*[last()]">
    <xsl:copy-of select="."/>
	<amps_rate unit="amps per ms"/>
	<volts_rate unit="volts per ms"/>
  </xsl:template>

  <xsl:template match="system_user_units/parameters/*[last()]">
    <xsl:copy-of select="."/>
	<parameter id="265740" mode="0" unit="milliseconds"/>
	<parameter id="265756" mode="0" unit="microseconds"/>
	<parameter id="264999" mode="0" unit="microseconds"/>
	<parameter id="265757" mode="0" unit="milliseconds"/>
	<parameter id="265738" mode="0" unit="milliseconds"/>
	<parameter id="264480" mode="0" unit="milliseconds"/>
	<parameter id="266244" mode="0" unit="hours"/>
	<parameter id="264998" mode="0" unit="microseconds"/>
	<parameter id="265000" mode="0" unit="milliseconds"/>
	<parameter id="265005" mode="0" unit="microseconds"/>
  </xsl:template>
  
  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>