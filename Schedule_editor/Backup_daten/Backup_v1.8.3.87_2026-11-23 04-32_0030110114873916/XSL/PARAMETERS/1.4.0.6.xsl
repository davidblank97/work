<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="/Parameters[@localeID='en-CA']">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
        <param id="263445">
          <name>ENERGY TELEMETRY</name>
          <short_name></short_name>
          <desc>The measurement of the amount of energy the power supply is putting into the part.</desc>
        </param>
        <param id="268272">
          <name>DIP ENERGY TELEMETRY</name>
          <short_name></short_name>
          <desc></desc>
        </param>
        <param id="265016">
          <name>PRE-DETACHMENT RAMP RATE</name>
          <short_name></short_name>
          <desc>NOT TO BE TRANSLATED</desc>
        </param>
        <param id="265017">
          <name>ENERGY</name>
          <short_name></short_name>
          <desc>NOT TO BE TRANSLATED</desc>
        </param>
        <param id="204817">
          <name>ENABLE VERBOSE DATA SUBSCRIBER LOG</name>
          <short_name>DATA SUBSCRIBER</short_name>
          <desc>Enables/disables the collection of verbose trace log data for the data subscriber class.</desc>
        </param>
    </xsl:copy>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>