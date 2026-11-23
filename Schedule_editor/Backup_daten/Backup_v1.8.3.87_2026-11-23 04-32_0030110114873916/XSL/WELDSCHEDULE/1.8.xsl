<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="sched/global/*[last()]">
    <xsl:copy-of select="."/>
	<aux_0_auto_postposition>0.0</aux_0_auto_postposition>
	<aux_1_auto_postposition>0.0</aux_1_auto_postposition>
  </xsl:template> 
  
  <xsl:template match="sched/segment/*[last()]">
    <xsl:copy-of select="."/>
	<detachment_amps>75</detachment_amps>
	<dip_burn_back_amps>230</dip_burn_back_amps>
	<wetting_amps>30</wetting_amps>
	<wetting_time_1>0.000500</wetting_time_1>
	<wetting_time_2>0.000500</wetting_time_2>
	<dip_min_burn_back_time>0.002</dip_min_burn_back_time>
	<clear_short_ramp_rate>60</clear_short_ramp_rate>
	<detect_short_threshold>60</detect_short_threshold>
	<clear_short_threshold>40</clear_short_threshold>
	<detach_ramp_rate>300</detach_ramp_rate>
	<dip_burn_back_decay_period>0.000200</dip_burn_back_decay_period>
	<clear_short_max_current>500</clear_short_max_current>
	<wetting_ramp_rate>120</wetting_ramp_rate>
	<dip_dynamics_enable_voltage>10</dip_dynamics_enable_voltage>
  </xsl:template> 
  
  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>