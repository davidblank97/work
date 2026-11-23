<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="/Parameters/param[@id='264972']">
	<param id="264972">
		<name>PRI VOLTS</name>
		<short_name>PRI</short_name>
		<desc>Short for 'Primary Automatic Voltage Control'. This refers to the AVC set point not the axis on the weld head. The voltage the system will try to maintain while welding during the PRIMARY portion of the pulsation cycle. The system will maintain this voltage by moving the AVC axis up and down.</desc>
	</param>
  </xsl:template>
  
  <xsl:template match="/Parameters/param[@id='264973']">
	<param id="264973">
		<name>BKG VOLTS</name>
		<short_name>BKG</short_name>
		<desc>Short for 'Background Automatic Voltage Control'. This refers to the AVC set point not the axis on the weld head. The voltage the system will try to maintain while welding during the BACKGROUND portion of the pulsation cycle. The system will maintain this voltage by moving the AVC axis up and down.</desc>
	</param>
  </xsl:template>
  
  <xsl:template match="/Parameters/param[@id='265014']">
	<param id="265014">
		<name>AVERAGE AMPS</name>
		<short_name></short_name>
		<desc>Average amps are used as setpoint for ACC (which is an acronym for 'Automatic Current Control').</desc>
	</param>
</xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>