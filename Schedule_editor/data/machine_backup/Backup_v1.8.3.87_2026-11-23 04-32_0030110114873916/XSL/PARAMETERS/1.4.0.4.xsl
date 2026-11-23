<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='67853']">
    <param id="67853">
      <name>FAULT COUNT THRESHOLD</name>
      <short_name></short_name>
      <desc>The amount of faults that the system will ignore before stopping the weld.</desc>
    </param>
  </xsl:template>
  
  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='67854']">
    <param id="69132">
      <name>DATA SAMPLER POWERSUPPLY MOVING AVERAGE WINDOW</name>
      <short_name></short_name>
      <desc>A value that smooths out the response of a AVC or ACC algorithm.</desc>
    </param>
  </xsl:template>

  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='264480']/short_name">
    <xsl:copy>
      <xsl:value-of select="'LOW SENSITIVITY'"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='200226']/name">
    <xsl:copy>
      <xsl:value-of select="'ALWAYS RETAIN LAST KNOWN POSITION AFTER ESTOP'"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="/Parameters[@localeID='en-CA']">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
      <param id="200228">
        <name>ALWAYS RESET LAST KNOWN POSITION AFTER ESTOP</name>
        <short_name></short_name>
        <desc>A setting that allows the user to always reset the last known position of all weld head axes if the position is lost due to an emergency stop.</desc>
      </param>
      <param id="200227">
        <name>POSITION DWELLS ON PENDANT PRESS</name>
        <short_name></short_name>
        <desc>A setting that enables dwell positioning when selecting indwell or outdwell on the pendant.</desc>
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